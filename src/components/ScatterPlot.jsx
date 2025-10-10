import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from "recharts";

const ScatterPlot = ({
  data,
  xKey = "x",
  yKey = "y",
  zKey,
  title,
  width = "100%",
  height = 300,
  scatterColor = "#8884d8",
  scatterShape = "circle",
  lastUpdate = null,
}) => {
  // Default sample data if none provided
  const defaultData = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ];

  const chartData = data || defaultData;

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
        <RechartsScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey={xKey} name={xKey} />
          <YAxis type="number" dataKey={yKey} name={yKey} />
          {zKey && <ZAxis type="number" dataKey={zKey} range={[60, 400]} name={zKey} />}
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter
            name={title || "Data"}
            data={chartData}
            fill={scatterColor}
            shape={scatterShape}
          />
        </RechartsScatterChart>
      </ResponsiveContainer>
      {lastUpdate && (
        <div className="chart-footer">
          <span className="last-update">Last update: {formatLastUpdate(lastUpdate)}</span>
        </div>
      )}
    </div>
  );
};

export default ScatterPlot;
