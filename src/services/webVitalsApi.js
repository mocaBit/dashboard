/**
 * Web Vitals API Service
 * Simulates API calls to fetch Web Vitals data from mock data
 */

import { generateMockData } from './utils.js';

const SIMULATED_DELAY = 300; // ms - simulate network delay
const APP_NAME = 'crypto-dashboard';
const TOTAL_RECORDS = 1000; // Total number of records to generate

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Cache for the data
let cachedData = null;

/**
 * Fetch all Web Vitals data
 * @returns {Promise<Object>} Complete dataset
 */
export const fetchAllWebVitalsData = async () => {
  try {
    await delay(SIMULATED_DELAY);

    if (cachedData) {
      return cachedData;
    }

    // Generate mock data for the last 30 days
    const endDateTime = new Date();
    const startDateTime = new Date(endDateTime.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Generate mock data using the helper
    const data = generateMockData(APP_NAME, startDateTime, endDateTime, TOTAL_RECORDS);
    cachedData = data;

    return data;
  } catch (error) {
    console.error('Error fetching Web Vitals data:', error);
    throw error;
  }
};

/**
 * Get Web Vitals records with pagination
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Records per page
 * @returns {Promise<Object>} Paginated results
 */
export const getWebVitalsRecords = async (page = 1, limit = 50) => {
  try {
    await delay(SIMULATED_DELAY);

    const data = await fetchAllWebVitalsData();
    const records = data.records || [];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecords = records.slice(startIndex, endIndex);

    return {
      data: paginatedRecords,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalRecords: records.length,
        totalPages: Math.ceil(records.length / limit),
        hasNextPage: endIndex < records.length,
        hasPreviousPage: page > 1
      },
      metadata: {
        version: data.version,
        generatedAt: data.generatedAt,
        dateRange: data.dateRange
      }
    };
  } catch (error) {
    console.error('Error getting paginated Web Vitals records:', error);
    throw error;
  }
};

/**
 * Get Web Vitals records filtered by date range
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {Promise<Array>} Filtered records
 */
export const getWebVitalsByDateRange = async (startDate, endDate) => {
  try {
    await delay(SIMULATED_DELAY);

    const data = await fetchAllWebVitalsData();
    const records = data.records || [];

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const filtered = records.filter(record => {
      const recordTime = new Date(record.datetime).getTime();
      return recordTime >= start && recordTime <= end;
    });

    return {
      data: filtered,
      count: filtered.length,
      dateRange: {
        start: startDate,
        end: endDate
      }
    };
  } catch (error) {
    console.error('Error filtering Web Vitals by date range:', error);
    throw error;
  }
};

/**
 * Get Web Vitals records filtered by browser
 * @param {string} browserName - Browser name (e.g., 'Chrome', 'Firefox')
 * @returns {Promise<Array>} Filtered records
 */
export const getWebVitalsByBrowser = async (browserName) => {
  try {
    await delay(SIMULATED_DELAY);

    const data = await fetchAllWebVitalsData();
    const records = data.records || [];

    const filtered = records.filter(
      record => record.metadata.browser.name.toLowerCase() === browserName.toLowerCase()
    );

    return {
      data: filtered,
      count: filtered.length,
      browser: browserName
    };
  } catch (error) {
    console.error('Error filtering Web Vitals by browser:', error);
    throw error;
  }
};

/**
 * Get Web Vitals records filtered by location (country)
 * @param {string} country - Country code (e.g., 'US', 'GB')
 * @returns {Promise<Array>} Filtered records
 */
export const getWebVitalsByLocation = async (country) => {
  try {
    await delay(SIMULATED_DELAY);

    const data = await fetchAllWebVitalsData();
    const records = data.records || [];

    const filtered = records.filter(
      record => record.metadata.location.country === country
    );

    return {
      data: filtered,
      count: filtered.length,
      country: country
    };
  } catch (error) {
    console.error('Error filtering Web Vitals by location:', error);
    throw error;
  }
};

/**
 * Get Web Vitals records filtered by device type
 * @param {string} deviceType - Device type (e.g., 'desktop', 'mobile', 'tablet')
 * @returns {Promise<Array>} Filtered records
 */
export const getWebVitalsByDevice = async (deviceType) => {
  try {
    await delay(SIMULATED_DELAY);

    const data = await fetchAllWebVitalsData();
    const records = data.records || [];

    const filtered = records.filter(
      record => record.metadata.device.type === deviceType
    );

    return {
      data: filtered,
      count: filtered.length,
      deviceType: deviceType
    };
  } catch (error) {
    console.error('Error filtering Web Vitals by device:', error);
    throw error;
  }
};

/**
 * Get aggregated Web Vitals statistics
 * @param {Array} filters - Optional filters object
 * @returns {Promise<Object>} Aggregated statistics
 */
export const getWebVitalsStats = async (filters = {}) => {
  try {
    await delay(SIMULATED_DELAY);

    const data = await fetchAllWebVitalsData();
    let records = data.records || [];

    // Apply filters if provided
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate).getTime();
      const end = new Date(filters.endDate).getTime();
      records = records.filter(record => {
        const recordTime = new Date(record.datetime).getTime();
        return recordTime >= start && recordTime <= end;
      });
    }

    if (filters.browser) {
      records = records.filter(
        record => record.metadata.browser.name.toLowerCase() === filters.browser.toLowerCase()
      );
    }

    if (filters.deviceType) {
      records = records.filter(
        record => record.metadata.device.type === filters.deviceType
      );
    }

    // Calculate statistics
    const calculateStats = (metric) => {
      const values = records.map(r => r.data[metric]);
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const sorted = [...values].sort((a, b) => a - b);
      const median = values.length % 2 === 0
        ? (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2
        : sorted[Math.floor(values.length / 2)];

      return {
        avg: Math.round(avg * 100) / 100,
        median: Math.round(median * 100) / 100,
        min: Math.min(...values),
        max: Math.max(...values),
        p75: sorted[Math.floor(values.length * 0.75)],
        p90: sorted[Math.floor(values.length * 0.90)],
        p95: sorted[Math.floor(values.length * 0.95)]
      };
    };

    return {
      totalRecords: records.length,
      metrics: {
        LCP: calculateStats('LCP'),
        FID: calculateStats('FID'),
        CLS: calculateStats('CLS'),
        FCP: calculateStats('FCP'),
        TTFB: calculateStats('TTFB'),
        INP: calculateStats('INP'),
        TBT: calculateStats('TBT'),
        SI: calculateStats('SI'),
        TTI: calculateStats('TTI')
      },
      filters: filters
    };
  } catch (error) {
    console.error('Error calculating Web Vitals statistics:', error);
    throw error;
  }
};

/**
 * Get Web Vitals data grouped by time intervals (hourly)
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {Promise<Array>} Time series data
 */
export const getWebVitalsTimeSeries = async (startDate, endDate) => {
  try {
    await delay(SIMULATED_DELAY);

    const data = await fetchAllWebVitalsData();
    const records = data.records || [];

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    // Filter by date range
    const filtered = records.filter(record => {
      const recordTime = new Date(record.datetime).getTime();
      return recordTime >= start && recordTime <= end;
    });

    // Group by hour
    const grouped = {};

    filtered.forEach(record => {
      const date = new Date(record.datetime);
      const hourKey = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).toISOString();

      if (!grouped[hourKey]) {
        grouped[hourKey] = [];
      }

      grouped[hourKey].push(record);
    });

    // Calculate averages for each hour
    const timeSeries = Object.keys(grouped).sort().map(hourKey => {
      const hourRecords = grouped[hourKey];
      const count = hourRecords.length;

      const avgMetrics = {
        LCP: Math.round(hourRecords.reduce((sum, r) => sum + r.data.LCP, 0) / count),
        FID: Math.round(hourRecords.reduce((sum, r) => sum + r.data.FID, 0) / count),
        CLS: Math.round((hourRecords.reduce((sum, r) => sum + r.data.CLS, 0) / count) * 1000) / 1000,
        FCP: Math.round(hourRecords.reduce((sum, r) => sum + r.data.FCP, 0) / count),
        TTFB: Math.round(hourRecords.reduce((sum, r) => sum + r.data.TTFB, 0) / count),
        INP: Math.round(hourRecords.reduce((sum, r) => sum + r.data.INP, 0) / count),
        TBT: Math.round(hourRecords.reduce((sum, r) => sum + r.data.TBT, 0) / count),
        SI: Math.round(hourRecords.reduce((sum, r) => sum + r.data.SI, 0) / count),
        TTI: Math.round(hourRecords.reduce((sum, r) => sum + r.data.TTI, 0) / count)
      };

      return {
        timestamp: hourKey,
        count: count,
        metrics: avgMetrics
      };
    });

    return {
      data: timeSeries,
      dateRange: {
        start: startDate,
        end: endDate
      },
      totalDataPoints: timeSeries.length
    };
  } catch (error) {
    console.error('Error generating Web Vitals time series:', error);
    throw error;
  }
};

/**
 * Clear cached data (useful for testing or forcing refresh)
 */
export const clearCache = () => {
  cachedData = null;
};
