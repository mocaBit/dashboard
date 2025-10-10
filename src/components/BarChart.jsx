import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChart = ({
  data,
  dataKey,
  xAxisKey = "name",
  title,
  width = "100%",
  height = 300,
  barColor = "#8884d8",
  lastUpdate = null,
}) => {
  // Default sample data if none provided
  const defaultData = [
    { name: "BTC", value: 45000 },
    { name: "ETH", value: 3200 },
    { name: "BNB", value: 420 },
    { name: "SOL", value: 110 },
    { name: "ADA", value: 0.95 },
    { name: "XRP", value: 0.65 },
  ];

  const chartData = data || defaultData;
  const key = dataKey || "value";

  const formatLastUpdate = (date) => {
    if (!date) return '';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width={width} height={height}>
        <RechartsBarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={key} fill={barColor} />
        </RechartsBarChart>
      </ResponsiveContainer>
      {lastUpdate && (
        <div className="chart-footer">
          <span className="last-update">Last update: {formatLastUpdate(lastUpdate)}</span>
        </div>
      )}
    </div>
  );
};

export default BarChart;
