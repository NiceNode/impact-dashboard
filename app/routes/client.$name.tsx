// app/routes/client/$name.jsx
import { useParams, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import Chart from "../Chart";
import { getDashData } from "../.server/getDashData";
import Headline from "../Headline";
import { Tables, Table } from "../Tables";

function findNodeByType(type: string, nodes: any): Node | undefined {
  return nodes.find((node) => node.type === type);
}

export async function loader({
  params,
}: LoaderFunctionArgs) {
  try {
    const dashData = await getDashData();
    const nodeName = params.name;
    if(!nodeName) {
      throw new Error("Node specId/name url param is required")
    }
    // console.log("dashData: ", logDeepObj(dashData))
    const chartData: { time: number; active: number }[] =
      dashData.monthlyActiveNodesIndexByDays.map((dayData) => {
        const timestamp = new Date(dayData.day).getTime();
        return {
          time: timestamp,
          active: dayData?.data?.specId?.[nodeName].count ?? 0,
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
      <Chart data={loadedData.chartData} type={params.name || ""} />
      <section id="info">
        *Updated daily around 12 AM UTC
      </section>
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
