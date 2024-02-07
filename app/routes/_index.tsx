import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Table } from "@radix-ui/themes";
import ChartNN from "../ChartNN";
import InfoIconPop from "../InfoIconPop";
import { getDashData } from "../.server/getDashData"
import { logDeepObj } from "../.server/util";

export async function loader() {
  try {
    const dashData = await getDashData()
    console.log("dashData: ", logDeepObj(dashData))
    const chartData: {time: number, active: number}[] = dashData.monthlyActiveNodesIndexByDays.map((dayData) => {
        const timestamp = new Date(dayData.day).getTime()
          return { 
            time: timestamp,
            active: dayData?.data?.count ?? 0
          }
      })
    return json({
      dashData,
      chartData
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

export default function Index() {
  const loadedData = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 48, marginRight: 5 }}>Active Nodes</div>{" "}
            {/* <Button> */}
            <InfoIconPop text="Running anytime in last 30 days" />
          </div>
          <div style={{ fontSize: 130 }}>{loadedData.dashData.numActiveNodes}</div>
        </div>
        <div style={{ width: 700, height: 400 }}>
          <ChartNN data={loadedData.chartData}/>
        </div>
      </div>
      <div>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Node Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Count</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loadedData?.dashData.activeNodesByType.map((rowData) => {
              return (
                <Table.Row key={rowData.type}>
                  <Table.RowHeaderCell>{rowData.type}</Table.RowHeaderCell>
                  <Table.Cell>{rowData.count}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </div>
      <br />
      <br />
      <div>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Country</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Count</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loadedData?.dashData.activeNodesByCountry.map((rowData) => {
              const countryCode = rowData.country
              const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
              const countryFullName = regionNames.of(countryCode) ?? countryCode;
              console.log("countryFullName: ", countryFullName)
              return (
                <Table.Row key={countryFullName}>
                  <Table.RowHeaderCell>{countryFullName}</Table.RowHeaderCell>
                  <Table.Cell>{rowData.count}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
}
