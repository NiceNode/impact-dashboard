// app/routes/client/$name.jsx
import { useParams, useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import Chart from "../Chart";
import { getDashData } from "../.server/getDashData";
import Headline from "../Headline";
import { Tables, Table } from "../Tables";

function findNodeByType(type: string, nodes: any): Node | undefined {
  return nodes.find((node) => node.type === type);
}

export async function loader() {
  try {
    const dashData = await getDashData();
    // console.log("dashData: ", logDeepObj(dashData))
    const chartData: { time: number; active: number }[] =
      dashData.monthlyActiveNodesIndexByDays.map((dayData) => {
        const timestamp = new Date(dayData.day).getTime();
        return {
          time: timestamp,
          active: dayData?.data?.count ?? 0,
        };
      });
    return json({
      dashData,
      chartData,
    });
    // activeNodesDailyHistory = JSON.parse(activeNodesDailyHistory);
  } catch (err) {
    console.error(err);
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: "NiceNode Impact Dashboard" },
    { name: "description", content: "View our impact" },
  ];
};

export default function Client() {
  const loadedData = useLoaderData<typeof loader>();
  const params = useParams();

  const clientData = findNodeByType(
    params.name ?? "",
    loadedData?.dashData.activeNodesByType,
  );

  const renderClientsRow = (rowData) => {
    return (
      <div className="table-row" key={rowData.name}>
        <div
          style={{
            backgroundImage: `url("../images/${rowData.name}.png")`,
          }}
          className={`table-cell client`}
        >
          {rowData.name}
        </div>
        <div className="table-cell">{rowData.count}%</div>
      </div>
    );
  };

  return (
    <>
      <Headline
        nodeCount={clientData?.count}
        countryCount={loadedData?.dashData.activeNodesByCountry.length}
        clientType={params.name}
      />
      <section id="warning">
        *Currently using mock data for this page until backend is implemented to
        show client-specific information
      </section>
      <Chart data={loadedData.chartData} type={params.name || ""} />
      <Tables>
        <Table
          title="Execution clients"
          data={clientData.clients.execution}
          dataKey="clients"
          renderRow={renderClientsRow}
        />
        <Table
          title="Consensus clients"
          data={clientData.clients.consensus}
          dataKey="clients"
          renderRow={renderClientsRow}
        />
        <Table
          title="Networks"
          data={clientData.networks}
          dataKey="networks"
          renderRow={(rowData) => (
            <div className="table-row" key={rowData.name}>
              <div className="table-cell">{rowData.name}</div>
              <div className="table-cell">{rowData.count}</div>
            </div>
          )}
        />
      </Tables>
    </>
  );
}
