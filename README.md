# Web Vitals Dashboard

A modern web application for monitoring and analyzing Web Vitals performance metrics with customizable charts and an interactive grid layout.

## Features

- **Real-time data simulation**: Live Web Vitals metrics generated every 2 seconds
- **Historical data**: 1000 mock records spanning the last 30 days
- **Interactive grid**: Drag and drop charts to customize your dashboard layout
- **Resizable charts**: Adjust chart dimensions in edit mode
- **Time range filters**: View data across different time periods (1D, 1W, 1M, 3M, 6M, 1Y, ALL)
- **Multiple chart types**: Bar charts, line charts, and area charts
- **Responsive design**: Works on desktop, tablet, and mobile devices
- **Edit mode**: Toggle between view and edit modes for dashboard customization
- **Real-time toggle**: Enable/disable real-time data streaming

## Technologies

- **React**: JavaScript library for building user interfaces
- **Vite**: Fast build tool for modern web development
- **Recharts**: Composable charting library built on React components
- **CSS Grid**: Native CSS grid layout for dashboard positioning
- **WebSocket Simulator**: Custom simulator for real-time data generation

## Installation

1. Clone the repository or navigate to the project directory:

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5173/dashboard/`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

## Web Vitals Metrics

This dashboard monitors the following Core Web Vitals and performance metrics:

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Loading performance
- **FID (First Input Delay)**: Interactivity
- **CLS (Cumulative Layout Shift)**: Visual stability
- **INP (Interaction to Next Paint)**: Responsiveness

### Additional Metrics
- **FCP (First Contentful Paint)**: Time to first content render
- **TTFB (Time to First Byte)**: Server response time
- **TTI (Time to Interactive)**: Time until page is fully interactive
- **SI (Speed Index)**: How quickly content is visually displayed
- **TBT (Total Blocking Time)**: Time blocked from user input

## Project Structure

```
dashboard/
├── src/
│   ├── components/
│   │   ├── DashboardGrid.jsx      # Main dashboard component
│   │   ├── DashboardGrid.css      # Dashboard styles
│   │   ├── BarChart.jsx           # Bar chart component
│   │   ├── LineChart.jsx          # Line chart component
│   │   ├── AreaChart.jsx          # Area chart component
│   │   └── ScatterPlot.jsx        # Scatter plot component
│   ├── hooks/
│   │   ├── useWebVitalsData.js    # Hook for fetching Web Vitals data
│   │   └── useWebSocketVitals.js  # Hook for real-time WebSocket data
│   ├── services/
│   │   ├── webVitalsApi.js        # API service with filtering and aggregation
│   │   ├── websocketService.js    # WebSocket simulator service
│   │   └── utils.js               # Data generation utilities
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
└── README.md
```

## Features Overview

### Dashboard Grid
- 5-column grid layout with unlimited rows (scrollable)
- Drag and drop charts to reposition them
- Visual grid lines in edit mode
- Size labels showing chart dimensions (e.g., 2x2, 1x2)
- Collision detection to prevent overlapping charts

### Chart Components
- **BarChart**: Display current Core Web Vitals (LCP, FID, CLS, INP)
- **LineChart**: Show loading performance trends over time (LCP, FCP, TTFB)
- **AreaChart**: Visualize interactivity and responsiveness metrics (TTI, SI, TBT)

### Real-time Mode
- Toggle real-time data streaming with the Real-time switch
- Visual indicator shows connection status (green when connected)
- Generates new Web Vitals records every 2 seconds
- Updates displayed in the console and on charts
- All generated records use current datetime

### Edit Mode
- Toggle edit mode with the Edit button in the header
- Drag charts to new positions
- Click Edit on any chart to adjust width and height
- Input-based resizing for precise control
- Visual feedback for valid/invalid drop zones

### Time Range Filter
- Global filter affecting all charts
- Options: 1D, 1W, 1M, 3M, 6M, 1Y, ALL
- Automatically fetches new data when changed
- Loading indicator during data processing
- Error handling with user feedback

## Data Model

### Web Vitals Record Structure

```javascript
{
  "datetime": "2025-10-10T15:30:45.123Z",
  "appName": "crypto-dashboard",
  "data": {
    "LCP": 2450,
    "FID": 85,
    "CLS": 0.045,
    "FCP": 1200,
    "TTFB": 450,
    "INP": 120,
    "TBT": 340,
    "SI": 2100,
    "TTI": 2800
  },
  "metadata": {
    "browser": {
      "name": "Chrome",
      "version": "120.0.0",
      "engine": "Blink",
      "userAgent": "Mozilla/5.0..."
    },
    "location": {
      "country": "US",
      "city": "New York",
      "region": "NY",
      "timezone": "America/New_York",
      "ip": "203.0.113.42"
    },
    "device": {
      "type": "desktop",
      "os": "macOS",
      "screenResolution": "1920x1080",
      "viewport": "1440x900"
    },
    "connection": {
      "type": "4g",
      "downlink": 10,
      "rtt": 50
    }
  }
}
```

### Chart Item Structure

```javascript
{
  id: 'chart-1',
  chart: 'bar',              // Type: 'bar', 'line', 'area'
  title: 'Chart Title',
  position: [0, 0],          // [column, row]
  width: 2,                  // columns (1-5)
  height: 2,                 // rows
  data: [...],               // Chart data array
  config: {                  // Chart-specific configuration
    dataKey: 'value',
    barColor: '#8884d8'
  }
}
```

## API Service Features

The Web Vitals API service provides the following functions:

- `fetchAllWebVitalsData()` - Get all Web Vitals data
- `getWebVitalsRecords(page, limit)` - Paginated records
- `getWebVitalsByDateRange(startDate, endDate)` - Filter by date range
- `getWebVitalsByBrowser(browserName)` - Filter by browser
- `getWebVitalsByLocation(country)` - Filter by location
- `getWebVitalsByDevice(deviceType)` - Filter by device type
- `getWebVitalsStats(filters)` - Aggregated statistics with percentiles
- `getWebVitalsTimeSeries(startDate, endDate)` - Time series data grouped by hour

## Performance Ratings

Metrics are rated according to Google's Web Vitals thresholds:

### LCP (Largest Contentful Paint)
- Good: Less than or equal to 2500ms
- Needs Improvement: 2500ms - 4000ms
- Poor: Greater than 4000ms

### FID (First Input Delay)
- Good: Less than or equal to 100ms
- Needs Improvement: 100ms - 300ms
- Poor: Greater than 300ms

### CLS (Cumulative Layout Shift)
- Good: Less than or equal to 0.1
- Needs Improvement: 0.1 - 0.25
- Poor: Greater than 0.25

### INP (Interaction to Next Paint)
- Good: Less than or equal to 200ms
- Needs Improvement: 200ms - 500ms
- Poor: Greater than 500ms

## Generating Mock Data

To regenerate the mock data:

```bash
node scripts/generateMockData.js
```

This will create a new `public/data/webVitalsData.json` file with 500 records distributed over 3 days.

## Supported Browsers

- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome. Please open an issue or pull request for suggestions or improvements.
