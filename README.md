# Crypto Dashboard

A modern web application for visualizing real-time cryptocurrency data with customizable charts and an interactive grid layout.

## Features

- **Real-time data**: Live cryptocurrency information from CoinGecko API
- **Interactive grid**: Drag and drop charts to customize your dashboard layout
- **Resizable charts**: Adjust chart dimensions in edit mode
- **Time range filters**: View data across different time periods (1D, 1W, 1M, 3M, 6M, 1Y, ALL)
- **Multiple chart types**: Bar charts, line charts, area charts, and scatter plots
- **Responsive design**: Works on desktop, tablet, and mobile devices
- **Edit mode**: Toggle between view and edit modes for dashboard customization

## Technologies

- **React**: JavaScript library for building user interfaces
- **Vite**: Fast build tool for modern web development
- **Recharts**: Composable charting library built on React components
- **CoinGecko API**: Free API for cryptocurrency data
- **CSS Grid**: Native CSS grid layout for dashboard positioning

## Installation

1. Clone the repository or navigate to the project directory:
```bash
cd crypto-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

## API Used

This application uses the [CoinGecko API](https://www.coingecko.com/en/api) which is free and does not require authentication for basic usage.

## Project Structure

```
crypto-dashboard/
├── src/
│   ├── components/
│   │   ├── DashboardGrid.jsx    # Main dashboard component
│   │   ├── DashboardGrid.css    # Dashboard styles
│   │   ├── BarChart.jsx         # Bar chart component
│   │   ├── LineChart.jsx        # Line chart component
│   │   ├── AreaChart.jsx        # Area chart component
│   │   └── ScatterPlot.jsx      # Scatter plot component
│   ├── hooks/
│   │   └── useCryptoData.js     # Custom hook for API data fetching
│   ├── services/
│   │   └── cryptoApi.js         # API service layer
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
- **BarChart**: Display current cryptocurrency prices
- **LineChart**: Show price trends over time for multiple cryptocurrencies
- **AreaChart**: Visualize portfolio growth and trading volume
- **ScatterPlot**: Compare price vs volume relationships

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
- Loading indicator during API requests
- Error handling with user feedback

## Data Model

Each chart item follows this structure:

```javascript
{
  id: 'chart-1',
  chart: 'bar',              // Type: 'bar', 'line', 'area', 'scatter'
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

## Supported Browsers

- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome. Please open an issue or pull request for suggestions or improvements.
