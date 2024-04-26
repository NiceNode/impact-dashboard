// app/routes/client/$name.jsx
import { useParams, useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import Chart from "../Chart";
import { getDashData } from "../.server/getDashData";

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

  console.log("clientData", clientData);

  return (
    <>
      <section id="top">
        <div className="headerTextContainer client">
          <h1 className="headline-primary client">{params.name}</h1>
          <div className="headline-secondary client">
            Currently
            <span className={`headline-node client ${params.name}`}>
              {" " + (clientData?.count ?? 0)} {params.name} nodes
            </span>{" "}
            across
            <span className="headline-countries">
              {" " + loadedData?.dashData.activeNodesByCountry.length} countries
            </span>
            .
          </div>
        </div>
      </section>
      <section id="chart">
        <Chart data={loadedData.chartData} type={params.name || ""} />
      </section>
      <section id="tables">
        <div className="table-section" id="nodeType">
          <h3>Execution clients</h3>
          <div className="table">
            <div className="table-row">
              <div className="table-cell">Name</div>
              <div className="table-cell">Share</div>
            </div>
            {clientData?.clients.execution.map((rowData) => {
              return (
                <div className="table-row" key={rowData.name}>
                  <div className={`table-cell client ${rowData.name}`}>
                    {rowData.name}
                  </div>
                  <div className="table-cell">{rowData.count}%</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="table-section" id="nodeType">
          <h3>Consensus clients</h3>
          <div className="table">
            <div className="table-row">
              <div className="table-cell">Name</div>
              <div className="table-cell">Share</div>
            </div>
            {clientData.clients.consensus.map((rowData) => {
              return (
                <div className="table-row" key={rowData.name}>
                  <div className={`table-cell client ${rowData.name}`}>
                    {rowData.name}
                  </div>
                  <div className="table-cell">{rowData.count}%</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="table-section" id="nodeType">
          <h3>Networks</h3>
          <div className="table">
            <div className="table-row">
              <div className="table-cell">Name</div>
              <div className="table-cell">Nodes</div>
            </div>
            {clientData?.networks.map((rowData) => {
              return (
                <div className="table-row" key={rowData.name}>
                  <div className={`table-cell ${rowData.name}`}>
                    {rowData.name}
                  </div>
                  <div className="table-cell">{rowData.count}%</div>
                </div>
              );
            }) ?? []}
          </div>
        </div>
      </section>
    </>
  );
}
