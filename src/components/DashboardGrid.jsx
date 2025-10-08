import { useState, useCallback, useRef } from 'react';
import './DashboardGrid.css';
import BarChart from './BarChart';
import LineChart from './LineChart';
import AreaChart from './AreaChart';

const DashboardGrid = () => {
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);
  const [editingChart, setEditingChart] = useState(null);

  // Chart items with position, size, type and data
  const [chartItems, setChartItems] = useState([
    {
      id: 'chart-1',
      chart: 'bar',
      title: 'Crypto Prices',
      position: [0, 0], // [column, row]
      width: 2, // columns
      height: 2, // rows
      data: [
        { name: 'BTC', value: 45000 },
        { name: 'ETH', value: 3200 },
        { name: 'BNB', value: 420 },
        { name: 'SOL', value: 110 },
      ],
      config: {
        dataKey: 'value',
        barColor: '#8884d8',
      },
    },
    {
      id: 'chart-2',
      chart: 'line',
      title: 'Price Trends',
      position: [2, 0], // [column, row]
      width: 2,
      height: 2,
      data: [
        { name: 'Jan', btc: 40000, eth: 2800 },
        { name: 'Feb', btc: 42000, eth: 2950 },
        { name: 'Mar', btc: 45000, eth: 3100 },
        { name: 'Apr', btc: 43000, eth: 3000 },
        { name: 'May', btc: 47000, eth: 3300 },
        { name: 'Jun', btc: 46000, eth: 3200 },
      ],
      config: {
        dataKeys: ['btc', 'eth'],
        colors: ['#8884d8', '#82ca9d'],
      },
    },
    {
      id: 'chart-3',
      chart: 'area',
      title: 'Portfolio Growth',
      position: [4, 0], // [column, row]
      width: 1,
      height: 2,
      data: [
        { name: 'Jan', portfolio: 50000, profit: 5000 },
        { name: 'Feb', portfolio: 55000, profit: 7000 },
        { name: 'Mar', portfolio: 62000, profit: 9000 },
        { name: 'Apr', portfolio: 58000, profit: 6500 },
        { name: 'May', portfolio: 70000, profit: 12000 },
        { name: 'Jun', portfolio: 68000, profit: 10000 },
      ],
      config: {
        dataKeys: ['portfolio', 'profit'],
        colors: ['#8884d8', '#82ca9d'],
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

    const [col, row] = editingChart.position;

    // Validate size
    if (col + editingChart.width > 5) {
      alert('Width exceeds grid bounds (max 5 columns)');
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

  // Check if a position is valid for placing a chart
  const checkCanPlace = (col, row, width, height, excludeId = null) => {
    // Check bounds
    if (col < 0 || row < 0 || col + width > 5 || width < 1 || height < 1) return false;

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
    const maxCols = 5;

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
                  + Add Chart
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
            <h2>Crypto Dashboard</h2>
            <p>Drag and resize charts to customize your view</p>
          </div>
          <button
            className={`edit-mode-btn ${isEditMode ? 'active' : ''}`}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? '✓ Done' : '✎ Edit'}
          </button>
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
              <div className="chart-size-label">
                {item.width}×{item.height}
              </div>
              {isEditMode && !editingChart && (
                <button className="edit-chart-btn" onClick={() => handleEditChart(item)}>
                  ✎ Edit
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
                        max="5"
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
                      ✓ Save
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      ✕ Cancel
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
