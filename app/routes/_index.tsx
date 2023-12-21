import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Redis } from "@upstash/redis";
import { Button, IconButton, Table } from "@itsmapleleaf/radix-themes";
import ChartNN from "../ChartNN";
import InfoIconPop from "../InfoIconPop";

const activeByNodeTypeArr = [
  {
    region: "Ethereum",
    count: 10,
  },
  {
    region: "Farcaster",
    count: 8,
  },
  {
    region: "Optimism",
    count: 5,
  },
  {
    region: "Arbitrum",
    count: 5,
  },
  {
    region: "Base",
    count: 2,
  },
];

const activeByRegionArr = [
  {
    region: "USA",
    count: 10,
  },
  {
    region: "Australia",
    count: 20,
  },
  {
    region: "Thailand",
    count: 5,
  },
  {
    region: "Germany",
    count: 100,
  },
  {
    region: "Other",
    count: 5,
  },
];

export async function loader() {
  if (
    process.env.UPSTASH_URL === undefined ||
    process.env.UPSTASH_TOKEN === undefined
  ) {
    throw new Error("env vars UPSTASH_URL and UPSTASH_TOKEN must be set.");
  }
  const rurl: string = process.env.UPSTASH_URL;
  const rtoken: string = process.env.UPSTASH_TOKEN;

  const redis = new Redis({
    url: rurl,
    token: rtoken,
  });

  // provides data to the component
  let numActiveNodes: number | null = await redis.get("numActiveNodes");
  console.log("numActiveNodes:", numActiveNodes);
  if (typeof numActiveNodes === null) {
    numActiveNodes = -1;
  }
  let activeNodesDailyHistory: string | null = await redis.get(
    "activeNodesDailyHistory",
  );
  console.log("activeNodesDailyHistory:", activeNodesDailyHistory);

  if (activeNodesDailyHistory === null) {
    activeNodesDailyHistory = "{}";
  }
  try {
    // activeNodesDailyHistory = JSON.parse(activeNodesDailyHistory);
  } catch (err) {
    console.error(err);
  }
  return json({
    numActiveNodes,
    activeNodesDailyHistory,
  });
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
            <InfoIconPop text="Running anytime in last 7 days" />
          </div>
          <div style={{ fontSize: 130 }}>{loadedData.numActiveNodes}</div>
        </div>
        <div style={{ width: 700, height: 400 }}>
          <ChartNN />
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
            {activeByNodeTypeArr.map((rowData) => {
              return (
                <Table.Row key={rowData.region}>
                  <Table.RowHeaderCell>{rowData.region}</Table.RowHeaderCell>
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
              <Table.ColumnHeaderCell>Region</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Count</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {activeByRegionArr.map((rowData) => {
              return (
                <Table.Row key={rowData.region}>
                  <Table.RowHeaderCell>{rowData.region}</Table.RowHeaderCell>
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
