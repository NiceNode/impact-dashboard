import {
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { convertUTCTimestampToMonthDay } from "./util";

const data = [
  { time: 1702684800000, active: 1 },
  { time: 1702771200000, active: 5 },
  { time: 1702857600000, active: 50 },
  { time: 1702944000000, active: 120 },
  { time: 1703030400000, active: 123 },
];

const graphData = data.map((point) => {
  return {
    ...point,
    time: convertUTCTimestampToMonthDay(point.time),
  };
});

const ChartNN = () => {
  return (
    <ResponsiveContainer>
      <LineChart
        id="activeChart"
        width={600}
        height={300}
        data={graphData}
        margin={{ top: 15, right: 30, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="active" stroke="#8884d8" />
        {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" /> */}
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartNN;
