import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ClientOnly } from "remix-utils/client-only";
import { useTheme } from "./contexts/ThemeContext";

// const data = [
//   { time: 1702684800000, active: 1 },
//   { time: 1702771200000, active: 5 },
//   { time: 1702857600000, active: 50 },
//   { time: 1702944000000, active: 120 },
//   { time: 1703030400000, active: 123 },
// ];

type ChartStyleProp = {
  linearGradient: string[];
  lineColor: string;
  color: string;
  toolTipColor: string;
  yAxisFormat: string;
};

const Chart = (props: {
  data: { time: number; active: number }[];
  type: string;
}) => {
  // Sorts data from earliest to latest timestamp is left to right on the chart
  // Assumes data is already in the correct format for Highcharts (x for time, y for active)

  const { theme } = useTheme();
  const graphData = props.data
    .sort((a, b) => a.time - b.time)
    .map((point) => ({
      x: point.time, // Highcharts uses milliseconds for datetime
      y: point.active,
    }));

  const getChartProps = () => {
    let chartProps = {
      linearGradient: [],
      lineColor: "",
      color: theme === "light" ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)",
      toolTipColor:
        theme === "light" ? "rgba(255, 255, 255, 0.80)" : "rgba(0, 0, 0, 0.80)",
      yAxisFormat: "",
    } as ChartStyleProp;
    switch (props.type) {
      case "overview":
        chartProps = {
          linearGradient:
            theme === "light"
              ? ["rgba(115, 81, 235, 0.32)", "rgba(115, 81, 235, 0.08)"]
              : ["rgba(130, 103, 239, 0.64)", "rgba(130, 103, 239, 0.16)"],
          lineColor:
            theme === "light"
              ? "rgba(115, 81, 235, 1)"
              : "rgba(130, 103, 239, 1)",
          toolTipColor: chartProps.toolTipColor,
          color: chartProps.color,
          yAxisFormat: "{value}",
        };
        break;
      case "ethereum":
        chartProps = {
          linearGradient:
            theme === "light"
              ? ["rgba(109, 163, 249, 0.32)", "rgba(109, 163, 249, 0.08)"]
              : ["rgba(109, 163, 249, 0.64)", "rgba(109, 163, 249, 0.16)"],
          lineColor:
            theme === "light"
              ? "rgba(58, 95, 233, 1)"
              : "rgba(66, 106, 255, 1)",
          toolTipColor: chartProps.toolTipColor,
          color: chartProps.color,
          yAxisFormat: "{value}",
        };
        break;
      default:
        chartProps = {
          linearGradient:
            theme === "light"
              ? ["rgba(115, 81, 235, 0.32)", "rgba(115, 81, 235, 0.08)"]
              : ["rgba(130, 103, 239, 0.64)", "rgba(130, 103, 239, 0.16)"],
          lineColor:
            theme === "light"
              ? "rgba(115, 81, 235, 1)"
              : "rgba(130, 103, 239, 1)",
          toolTipColor: chartProps.toolTipColor,
          color: chartProps.color,
          yAxisFormat: "{value}",
        };
    }
    return chartProps;
  };

  const { linearGradient, lineColor, toolTipColor, yAxisFormat, color } =
    getChartProps();

  const gridLineColor =
    theme === "light" ? "rgba(0, 0, 0, 0.24)" : "rgba(255, 255, 255, 0.24)";
  const fontColor =
    theme === "light" ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";

  const chartOptions = {
    chart: {
      type: "area",
      height: 335,
      style: {
        fontFamily: "'SF Pro', sans-serif",
      },
      backgroundColor: "transparent",
      spacingLeft: 0,
    },
    title: {
      text: null,
    },
    xAxis: {
      type: "datetime",
      lineColor: "rgba(0, 0, 2, 0.01)", // Set the x-axis line color to semi-transparent red
      labels: {
        // format: "{value:%H:%M}",
        style: {
          color: fontColor,
          fontFamily: "'SF Pro', sans-serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "11px",
          lineHeight: "14px",
          fontFeatureSettings: "'tnum' on, 'lnum' on",
        },
      },
      tickLength: null,
      minPadding: 0,
      maxPadding: 0,
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        format: yAxisFormat,
        style: {
          color: fontColor, // Change the Y-axis text color
          fontFamily: "'SF Pro', sans-serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "11px",
          lineHeight: "14px",
          fontFeatureSettings: "'tnum' on, 'lnum' on",
        },
      },
      tickPositions: null,
      gridLineColor: gridLineColor,
      opposite: true,
    },
    time: {
      useUTC: false,
    },
    series: [
      {
        name: "",
        data: graphData,
        color: lineColor,
        fillColor: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, linearGradient[0]],
            [1, linearGradient[1]],
          ],
        },
        lineWidth: 2,
        marker: {
          enabled: false,
        },
        threshold: null,
        turboThreshold: 0,
        animation: false,
      },
    ],
    tooltip: {
      backgroundColor: toolTipColor,
      borderStyle: "solid",
      borderWidth: 2,
      borderRadius: 16,
      borderColor: color,
      useHTML: true,
      className: `custom-tooltip ${props.type}`,
      style: {
        color: color,
      },
      formatter(this: Highcharts.TooltipFormatterContextObject): string {
        return `
          <div>
            <div>Node Type</div>
            <div>
              <div style="background-color: ${lineColor}"}></div>
              <div>
                <div>${Highcharts.dateFormat("%b %e, %Y", this.x)}</div>
                <div><span>${this.y}</span> active</div>
              </div>
            </div>
          </div>
        `;
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  };

  return (
    // TODO: Add a loading spinner
    <ClientOnly fallback={<p>Loading...</p>}>
      {() => (
        <section id="chart">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </section>
      )}
    </ClientOnly>
  );
};

export default Chart;
