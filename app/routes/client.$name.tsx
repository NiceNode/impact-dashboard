// app/routes/client/$name.jsx
import React from "react";
import { useParams } from "@remix-run/react";

import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ChartNN from "../ChartNN";
import InfoIconPop from "../InfoIconPop";
import { getDashData } from "../.server/getDashData";
import { logDeepObj } from "../.server/util";

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

export default function Index() {
  const loadedData = useLoaderData<typeof loader>();
  const params = useParams();

  return (
    <>
      <section id="top">
        <div className="headerTextContainer">
          <h1 className="headline-primary">{params.name}</h1>
        </div>
      </section>
      <section id="chart">
        <ChartNN data={loadedData.chartData} />
      </section>
      <section id="tables">
        <div className="table-section" id="nodeType">
          <h3>Node type</h3>
          <div className="table">
            <div className="table-row">
              <div className="table-cell">Name</div>
              <div className="table-cell">Nodes</div>
            </div>
            {loadedData?.dashData.activeNodesByType.map((rowData) => {
              return (
                <div className="table-row" key={rowData.type}>
                  <div className={`table-cell client ${rowData.type}`}>
                    {rowData.type}
                  </div>
                  <div className="table-cell">{rowData.count}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="table-section" id="country">
          <h3>Country</h3>
          <div className="table">
            <div className="table-row">
              <div className="table-cell">Name</div>
              <div className="table-cell">Nodes</div>
            </div>
            {loadedData?.dashData.activeNodesByCountry.map((rowData) => {
              const countryCode = rowData.country;
              const regionNames = new Intl.DisplayNames(["en"], {
                type: "region",
              });
              const countryFullName =
                regionNames.of(countryCode) ?? countryCode;
              return (
                <div className="table-row" key={countryFullName}>
                  <div className={`table-cell`}>{countryFullName}</div>
                  <div className="table-cell">{rowData.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
