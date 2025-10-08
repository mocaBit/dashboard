import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AreaChart = ({
  data,
  dataKeys = ["value"],
  xAxisKey = "name",
  title,
  width = "100%",
  height = 300,
  colors = ["#8884d8", "#82ca9d", "#ffc658"],
  stacked = false,
}) => {
  // Default sample data if none provided
  const defaultData = [
    { name: "Jan", portfolio: 50000, profit: 5000, loss: 2000 },
    { name: "Feb", portfolio: 55000, profit: 7000, loss: 2500 },
    { name: "Mar", portfolio: 62000, profit: 9000, loss: 2200 },
    { name: "Apr", portfolio: 58000, profit: 6500, loss: 4000 },
    { name: "May", portfolio: 70000, profit: 12000, loss: 3000 },
    { name: "Jun", portfolio: 68000, profit: 10000, loss: 4000 },
  ];

  const chartData = data || defaultData;
  const keys = dataKeys.length > 0 ? dataKeys : ["portfolio", "profit", "loss"];

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width={width} height={height}>
        <RechartsAreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId={stacked ? "1" : undefined}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.6}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
