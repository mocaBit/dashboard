import { useState, useEffect, useCallback } from 'react';
import { getWebVitalsStats, getWebVitalsTimeSeries } from '../services/webVitalsApi';

// Map time range to date calculations
const getDateRange = (timeRange) => {
  const now = new Date();
  const endDate = now.toISOString();
  let startDate;

  switch (timeRange) {
    case '1D':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      break;
    case '1W':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case '1M':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case '3M':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case '6M':
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case '1Y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'ALL':
    default:
      // Use the entire dataset (3 days in our mock data)
      startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
      break;
  }

  return { startDate, endDate };
};

/**
 * Custom hook to fetch Web Vitals data
 * @param {string} timeRange - Time range for data ('1D', '1W', '1M', '3M', '6M', '1Y', 'ALL')
 * @returns {Object} { data, isLoading, error, refetch }
 */
export const useWebVitalsData = (timeRange = 'ALL') => {
  const [data, setData] = useState({
    barData: [],
    lineData: [],
    areaData: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWebVitalsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = getDateRange(timeRange);

      // Fetch statistics and time series data
      const [stats, timeSeries] = await Promise.all([
        getWebVitalsStats({ startDate, endDate }),
        getWebVitalsTimeSeries(startDate, endDate)
      ]);

      // Bar chart data - Core Web Vitals current values
      const barData = [
        { name: 'LCP', value: stats.metrics.LCP.avg, rating: getLCPRating(stats.metrics.LCP.avg) },
        { name: 'FID', value: stats.metrics.FID.avg, rating: getFIDRating(stats.metrics.FID.avg) },
        { name: 'CLS', value: stats.metrics.CLS.avg * 1000, rating: getCLSRating(stats.metrics.CLS.avg) }, // Multiply for better visualization
        { name: 'INP', value: stats.metrics.INP.avg, rating: getINPRating(stats.metrics.INP.avg) },
      ];

      // Line chart data - LCP and FCP over time
      const lineData = timeSeries.data.map(point => {
        const date = new Date(point.timestamp);
        return {
          name: formatTimestamp(date, timeRange),
          LCP: point.metrics.LCP,
          FCP: point.metrics.FCP,
          TTFB: point.metrics.TTFB,
        };
      });

      // Area chart data - Performance metrics over time
      const areaData = timeSeries.data.map(point => {
        const date = new Date(point.timestamp);
        return {
          name: formatTimestamp(date, timeRange),
          TTI: point.metrics.TTI,
          SI: point.metrics.SI,
          TBT: point.metrics.TBT,
        };
      });

      setData({ barData, lineData, areaData });
    } catch (err) {
      setError(err.message || 'Failed to fetch Web Vitals data');
      console.error('Error fetching Web Vitals data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  // Fetch data when time range changes
  useEffect(() => {
    fetchWebVitalsData();
  }, [fetchWebVitalsData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchWebVitalsData,
  };
};

// Helper functions to get ratings based on Web Vitals thresholds
const getLCPRating = (value) => {
  if (value <= 2500) return 'good';
  if (value <= 4000) return 'needs-improvement';
  return 'poor';
};

const getFIDRating = (value) => {
  if (value <= 100) return 'good';
  if (value <= 300) return 'needs-improvement';
  return 'poor';
};

const getCLSRating = (value) => {
  if (value <= 0.1) return 'good';
  if (value <= 0.25) return 'needs-improvement';
  return 'poor';
};

const getINPRating = (value) => {
  if (value <= 200) return 'good';
  if (value <= 500) return 'needs-improvement';
  return 'poor';
};

// Format timestamp based on time range
const formatTimestamp = (date, timeRange) => {
  if (timeRange === '1D') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (timeRange === '1W' || timeRange === '1M') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};
