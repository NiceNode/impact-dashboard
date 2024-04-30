import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import Chart from "../Chart";
import { getDashData } from "../.server/getDashData";
import Headline from "../Headline";
import { Tables, Table } from "../Tables";

export async function loader() {
  try {
    const dashData = await getDashData();
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

export default function Index() {
  const loadedData = useLoaderData<typeof loader>();
  return (
    <>
      <Headline
        nodeCount={loadedData.dashData.numActiveNodes}
        countryCount={loadedData?.dashData.activeNodesByCountry.length}
      />
      <Chart data={loadedData.chartData} type="overview" />
      <Tables>
        <Table
          title="Node type"
          data={loadedData?.dashData.activeNodesByType}
          dataKey="nodeType"
          renderRow={(rowData) => (
            <div className="table-row" key={rowData.type}>
              <div
                style={{
                  backgroundImage: `url("../images/${rowData.type}.png")`,
                }}
                className={`table-cell client`}
              >
                {rowData.type === "ethereum" ? (
                  <Link className="link" to={`/client/${rowData.type}`}>
                    {rowData.type}
                  </Link>
                ) : (
                  rowData.type
                )}
              </div>
              <div className="table-cell">{rowData.count}</div>
            </div>
          )}
        />
        <Table
          title="Country"
          data={loadedData?.dashData.activeNodesByCountry}
          dataKey="country"
          renderRow={(rowData) => {
            const countryCode = rowData.country;
            const regionNames = new Intl.DisplayNames(["en"], {
              type: "region",
            });
            const countryFullName = regionNames.of(countryCode) ?? countryCode;
            return (
              <div className="table-row" key={countryFullName}>
                <div className={`table-cell`}>{countryFullName}</div>
                <div className="table-cell">{rowData.count}</div>
              </div>
            );
          }}
        />
      </Tables>
    </>
  );
}
