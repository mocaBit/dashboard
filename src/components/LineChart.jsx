import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LineChart = ({
  data,
  dataKeys = ["value"],
  xAxisKey = "name",
  title,
  width = "100%",
  height = 300,
  colors = ["#8884d8", "#82ca9d", "#ffc658"],
  lastUpdate = null,
}) => {
  // Default sample data if none provided
  const defaultData = [
    { name: "Jan", btc: 40000, eth: 2800, bnb: 380 },
    { name: "Feb", btc: 42000, eth: 2950, bnb: 400 },
    { name: "Mar", btc: 45000, eth: 3100, bnb: 420 },
    { name: "Apr", btc: 43000, eth: 3000, bnb: 410 },
    { name: "May", btc: 47000, eth: 3300, bnb: 450 },
    { name: "Jun", btc: 46000, eth: 3200, bnb: 440 },
  ];

  const chartData = data || defaultData;
  const keys = dataKeys.length > 0 ? dataKeys : ["btc", "eth", "bnb"];

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
        <RechartsLineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
      {lastUpdate && (
        <div className="chart-footer">
          <span className="last-update">Last update: {formatLastUpdate(lastUpdate)}</span>
        </div>
      )}
    </div>
  );
};

export default LineChart;
