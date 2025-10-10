import { useState, useEffect } from 'react';
import './DashboardGrid.css';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import AreaChart from '../components/AreaChart';
import ScatterPlot from '../components/ScatterPlot';
import { useWebVitalsData } from '../hooks/useWebVitalsData';
import { useWebSocketWebVitals } from '../hooks/useWebSocketVitals';
import { Move, Circle, Edit2, Check, X, Plus } from 'react-feather';

const DashboardGrid = () => {
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);
  const [editingChart, setEditingChart] = useState(null);

  // Global filters
  const [timeRange, setTimeRange] = useState('ALL'); // '1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);

  // State for last update timestamp (can be from API or real-time)
  const [currentLastUpdate, setCurrentLastUpdate] = useState(null);

  // Fetch Web Vitals data using custom hook
  const { data: webVitalsData, lastUpdate, isLoading, error } = useWebVitalsData(timeRange);

  // WebSocket for real-time data
  const { latestRecord, isConnected, error: wsError } = useWebSocketWebVitals(realtimeEnabled);

  // Chart items with position, size, type and data
  const [chartItems, setChartItems] = useState([
    {
      id: 'chart-1',
      chart: 'bar',
      title: 'Core Web Vitals',
      position: [0, 0], // [column, row]
      width: 2, // columns
      height: 2, // rows
      data: [
        { name: 'LCP', value: 2450 },
        { name: 'FID', value: 85 },
        { name: 'CLS', value: 45 },
        { name: 'INP', value: 120 },
      ],
      config: {
        dataKey: 'value',
        barColor: '#8884d8',
      },
    },
    {
      id: 'chart-4',
      chart: 'bar',
      title: 'Browser Distribution',
      position: [0, 2], // [column, row]
      width: 2,
      height: 2,
      data: [],
      config: {
        dataKey: 'count',
        barColor: '#82ca9d',
      },
    },
    {
      id: 'chart-2',
      chart: 'line',
      title: 'Loading Performance Over Time',
      position: [2, 0], // [column, row]
      width: 2,
      height: 2,
      data: [
        { name: '00:00', LCP: 2400, FCP: 1200, TTFB: 450 },
        { name: '06:00', LCP: 2200, FCP: 1100, TTFB: 420 },
        { name: '12:00', LCP: 2600, FCP: 1300, TTFB: 480 },
        { name: '18:00', LCP: 2450, FCP: 1250, TTFB: 460 },
      ],
      config: {
        dataKeys: ['LCP', 'FCP', 'TTFB'],
        colors: ['#8884d8', '#82ca9d', '#ffc658'],
      },
    },
    {
      id: 'chart-3',
      chart: 'area',
      title: 'Interactivity & Responsiveness',
      position: [4, 0], // [column, row]
      width: 2,
      height: 2,
      data: [
        { name: '00:00', TTI: 2800, SI: 2100, TBT: 340 },
        { name: '06:00', TTI: 2600, SI: 1900, TBT: 310 },
        { name: '12:00', TTI: 3000, SI: 2300, TBT: 380 },
        { name: '18:00', TTI: 2850, SI: 2150, TBT: 350 },
      ],
      config: {
        dataKeys: ['TTI', 'SI', 'TBT'],
        colors: ['#8884d8', '#82ca9d', '#ff8042'],
      },
    },
    {
      id: 'chart-5',
      chart: 'scatter',
      title: 'LCP vs FID Correlation',
      position: [2, 2], // [column, row]
      width: 4,
      height: 2,
      data: [],
      config: {
        xKey: 'lcp',
        yKey: 'fid',
        zKey: 'cls',
        scatterColor: '#ff8042',
      },
    },
  ]);

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    if (!isEditMode) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverCell(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCellDragOver = (e, col, row) => {
    e.preventDefault();
    if (!draggedItem) return;
    setDragOverCell({ col, row });
  };

  const handleDrop = (e, targetCol, targetRow) => {
    e.preventDefault();
    if (!draggedItem || !isEditMode) return;

    // Check if the new position is valid (not overlapping with other charts)
    const canPlace = checkCanPlace(targetCol, targetRow, draggedItem.width, draggedItem.height, draggedItem.id);

    if (canPlace) {
      setChartItems(prevItems =>
        prevItems.map(item =>
          item.id === draggedItem.id
            ? { ...item, position: [targetCol, targetRow] }
            : item
        )
      );
    }

    setDraggedItem(null);
    setDragOverCell(null);
  };

  // Handle edit chart
  const handleEditChart = (item) => {
    setEditingChart({ ...item });
  };

  const handleSizeChange = (field, value) => {
    const numValue = parseInt(value) || 1;
    setEditingChart(prev => ({
      ...prev,
      [field]: Math.max(1, numValue)
    }));
  };

  const handleSaveSize = () => {
    if (!editingChart) return;

    const [col] = editingChart.position;

    // Validate size
    if (col + editingChart.width > 6) {
      alert('Width exceeds grid bounds (max 6 columns)');
      return;
    }

    if (editingChart.width < 1 || editingChart.height < 1) {
      alert('Width and height must be at least 1');
      return;
    }

    // Update chart
    setChartItems(prevItems =>
      prevItems.map(item =>
        item.id === editingChart.id
          ? { ...item, width: editingChart.width, height: editingChart.height }
          : item
      )
    );
    setEditingChart(null);
  };

  const handleCancelEdit = () => {
    setEditingChart(null);
  };

  // Update chart items when Web Vitals data changes
  useEffect(() => {
    if (webVitalsData.barData.length > 0) {
      setChartItems(prevItems =>
        prevItems.map(item => {
          if (item.id === 'chart-1' && item.chart === 'bar') {
            // Core Web Vitals bar chart
            return { ...item, data: webVitalsData.barData };
          } else if (item.id === 'chart-4' && item.chart === 'bar') {
            // Browser Distribution bar chart
            return { ...item, data: webVitalsData.browserData };
          } else if (item.chart === 'line') {
            return { ...item, data: webVitalsData.lineData };
          } else if (item.chart === 'area') {
            return { ...item, data: webVitalsData.areaData };
          } else if (item.chart === 'scatter') {
            return { ...item, data: webVitalsData.scatterData };
          }
          return item;
        })
      );
      // Update last update timestamp from API data (only if not in real-time mode)
      if (!realtimeEnabled && lastUpdate) {
        setCurrentLastUpdate(lastUpdate);
      }
    }
  }, [webVitalsData, lastUpdate, realtimeEnabled]);

  // Update chart items with real-time WebSocket data
  useEffect(() => {
    if (!realtimeEnabled || !isConnected || !latestRecord) return;

    const metrics = latestRecord.data;

    setChartItems(prevItems =>
      prevItems.map(item => {
        if (item.chart === 'bar') {
          // Update bar chart with real-time Core Web Vitals
          return {
            ...item,
            data: [
              { name: 'LCP', value: metrics.LCP },
              { name: 'FID', value: metrics.FID },
              { name: 'CLS', value: metrics.CLS * 1000 }, // Multiply for better visualization
              { name: 'INP', value: metrics.INP },
            ]
          };
        }
        // For line and area charts, keep historical data (could append new points if needed)
        return item;
      })
    );

    // Update last update timestamp with the datetime from real-time record
    if (latestRecord.datetime) {
      setCurrentLastUpdate(new Date(latestRecord.datetime));
    }
  }, [latestRecord, realtimeEnabled, isConnected]);

  // Check if a position is valid for placing a chart
  const checkCanPlace = (col, row, width, height, excludeId = null) => {
    // Check bounds
    if (col < 0 || row < 0 || col + width > 6 || width < 1 || height < 1) return false;

    // Check overlap with other items
    for (const item of chartItems) {
      if (item.id === excludeId) continue;

      const [itemCol, itemRow] = item.position;
      const itemRight = itemCol + item.width;
      const itemBottom = itemRow + item.height;
      const newRight = col + width;
      const newBottom = row + height;

      // Check if rectangles overlap
      if (!(newRight <= itemCol || col >= itemRight || newBottom <= itemRow || row >= itemBottom)) {
        return false;
      }
    }

    return true;
  };

  // Check if a cell is occupied
  const isCellOccupied = (col, row) => {
    return chartItems.some(item => {
      const [itemCol, itemRow] = item.position;
      const itemRight = itemCol + item.width;
      const itemBottom = itemRow + item.height;
      return col >= itemCol && col < itemRight && row >= itemRow && row < itemBottom;
    });
  };

  // Generate grid cells for empty cell detection
  const renderEmptyCells = () => {
    if (!isEditMode) return null;

    const cells = [];
    const maxVisibleRows = 20; // Allow scrolling beyond visible area
    const maxCols = 6;

    for (let row = 0; row < maxVisibleRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        if (!isCellOccupied(col, row)) {
          const isDragOver = dragOverCell?.col === col && dragOverCell?.row === row;
          const canDrop = draggedItem ? checkCanPlace(col, row, draggedItem.width, draggedItem.height, draggedItem.id) : false;

          cells.push(
            <div
              key={`cell-${col}-${row}`}
              className={`empty-cell ${isDragOver && canDrop ? 'drag-over-valid' : ''} ${isDragOver && !canDrop ? 'drag-over-invalid' : ''}`}
              style={{
                gridColumn: col + 1,
                gridRow: row + 1,
              }}
              onMouseEnter={() => setHoveredCell({ col, row })}
              onMouseLeave={() => setHoveredCell(null)}
              onDragOver={(e) => handleCellDragOver(e, col, row)}
              onDrop={(e) => handleDrop(e, col, row)}
            >
              {hoveredCell?.col === col && hoveredCell?.row === row && !draggedItem && (
                <button className="add-chart-btn" onClick={() => alert('Add chart functionality coming soon!')}>
                  <Plus size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Add Chart
                </button>
              )}
            </div>
          );
        }
      }
    }
    return cells;
  };

  const renderChart = (item) => {
    switch (item.chart) {
      case 'bar':
        return (
          <BarChart
            title={item.title}
            data={item.data}
            dataKey={item.config.dataKey}
            barColor={item.config.barColor}
            height={250}
            lastUpdate={currentLastUpdate}
          />
        );
      case 'line':
        return (
          <LineChart
            title={item.title}
            data={item.data}
            dataKeys={item.config.dataKeys}
            colors={item.config.colors}
            height={250}
            lastUpdate={currentLastUpdate}
          />
        );
      case 'area':
        return (
          <AreaChart
            title={item.title}
            data={item.data}
            dataKeys={item.config.dataKeys}
            colors={item.config.colors}
            height={250}
            lastUpdate={currentLastUpdate}
          />
        );
      case 'scatter':
        return (
          <ScatterPlot
            title={item.title}
            data={item.data}
            xKey={item.config.xKey}
            yKey={item.config.yKey}
            zKey={item.config.zKey}
            scatterColor={item.config.scatterColor}
            height={250}
            lastUpdate={currentLastUpdate}
          />
        );
      default:
        return <div>Unknown chart type</div>;
    }
  };

  return (
    <div className="dashboard-grid-container">
      <div className="grid-header">
        <div className="header-content">
          <div>
            <h2>Web Vitals Dashboard</h2>
            <p>Monitor and analyze your application's performance metrics</p>
          </div>
          <div className="header-controls">
            {/* Real-time Toggle */}
            <div className="realtime-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={realtimeEnabled}
                  onChange={(e) => setRealtimeEnabled(e.target.checked)}
                />
                <span className="toggle-text">
                  <Circle size={12} fill={isConnected ? '#4caf50' : '#ccc'} color={isConnected ? '#4caf50' : '#ccc'} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Real-time
                </span>
              </label>
              {wsError && <span className="error-indicator">WS Error: {wsError}</span>}
            </div>

            {/* Global Filters */}
            <div className="global-filters">
              <label className="filter-label">Time Range:</label>
              <div className="time-range-buttons">
                {['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
                  <button
                    key={range}
                    className={`time-range-btn ${timeRange === range ? 'active' : ''}`}
                    onClick={() => setTimeRange(range)}
                    disabled={isLoading}
                  >
                    {range}
                  </button>
                ))}
              </div>
              {isLoading && <span className="loading-indicator">Loading...</span>}
              {error && <span className="error-indicator">Error: {error}</span>}
            </div>
            <button
              className={`edit-mode-btn ${isEditMode ? 'active' : ''}`}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? (
                <>
                  <Check size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Done
                </>
              ) : (
                <>
                  <Edit2 size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Edit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid-wrapper">
        <div className={`css-grid-layout ${isEditMode ? 'edit-mode' : ''}`}>
          {chartItems.map((item) => (
            <div
              key={item.id}
              data-chart-id={item.id}
              className={`grid-item ${draggedItem?.id === item.id ? 'dragging' : ''} ${editingChart?.id === item.id ? 'editing' : ''}`}
              style={{
                gridColumn: `${item.position[0] + 1} / span ${item.width}`,
                gridRow: `${item.position[1] + 1} / span ${item.height}`,
              }}
              draggable={isEditMode && !editingChart}
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.position[0], item.position[1])}
            >
              {/* Drag handle icon - only visible in edit mode */}
              {isEditMode && !editingChart && (
                <div className="drag-handle">
                  <Move size={18} />
                </div>
              )}

              {isEditMode && !editingChart && (
                <button className="edit-chart-btn" onClick={() => handleEditChart(item)}>
                  <Edit2 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                </button>
              )}
              {editingChart?.id === item.id && (
                <div className="edit-size-panel">
                  <div className="edit-size-inputs">
                    <label>
                      Width:
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={editingChart.width}
                        onChange={(e) => handleSizeChange('width', e.target.value)}
                      />
                    </label>
                    <label>
                      Height:
                      <input
                        type="number"
                        min="1"
                        value={editingChart.height}
                        onChange={(e) => handleSizeChange('height', e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="edit-size-buttons">
                    <button className="save-btn" onClick={handleSaveSize}>
                      <Check size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Save
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      <X size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Cancel
                    </button>
                  </div>
                </div>
              )}
              <div className="grid-item-content">
                {renderChart(item)}
              </div>
            </div>
          ))}
          {renderEmptyCells()}
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;
