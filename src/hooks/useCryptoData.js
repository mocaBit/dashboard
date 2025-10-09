import { useState, useEffect, useCallback } from 'react';

const cryptoIds = ['bitcoin', 'ethereum', 'binancecoin', 'solana'];

  // Map time range to days
  const daysMap = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    'ALL': 'max'
  };

/**
 * Custom hook to fetch cryptocurrency data from CoinGecko API
 * @param {string} timeRange - Time range for historical data ('1D', '1W', '1M', '3M', '6M', '1Y', 'ALL')
 * @returns {Object} { data, isLoading, error, refetch }
 */
export const useCryptoData = (timeRange = '1M') => {
  const [data, setData] = useState({
    barData: [],
    lineData: [],
    areaData: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCryptoData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const days = daysMap[timeRange] || 30;

      // Fetch current prices for bar chart
      const pricesResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd`
      );

      if (!pricesResponse.ok) {
        throw new Error('Failed to fetch current prices');
      }

      const pricesData = await pricesResponse.json();

      const barData = [
        { name: 'BTC', value: pricesData.bitcoin?.usd || 0 },
        { name: 'ETH', value: pricesData.ethereum?.usd || 0 },
        { name: 'BNB', value: pricesData.binancecoin?.usd || 0 },
        { name: 'SOL', value: pricesData.solana?.usd || 0 },
      ];

      // Fetch historical data for line and area charts (Bitcoin and Ethereum)
      const [btcHistoricalResponse, ethHistoricalResponse] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`),
        fetch(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}`)
      ]);

      if (!btcHistoricalResponse.ok || !ethHistoricalResponse.ok) {
        throw new Error('Failed to fetch historical data');
      }

      const btcHistorical = await btcHistoricalResponse.json();
      const ethHistorical = await ethHistoricalResponse.json();

      // Process line chart data - sample every N points to avoid too many data points
      const sampleRate = Math.max(1, Math.floor(btcHistorical.prices.length / 30));
      const lineData = btcHistorical.prices
        .filter((_, index) => index % sampleRate === 0)
        .map((btcPrice, index) => {
          const ethPrice = ethHistorical.prices[index * sampleRate];
          const date = new Date(btcPrice[0]);
          return {
            name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            btc: Math.round(btcPrice[1]),
            eth: ethPrice ? Math.round(ethPrice[1]) : 0,
          };
        });

      // Process area chart data (using market cap as portfolio, volume as profit)
      const areaData = btcHistorical.market_caps
        .filter((_, index) => index % sampleRate === 0)
        .map((cap, index) => {
          const volume = btcHistorical.total_volumes[index * sampleRate];
          const date = new Date(cap[0]);
          return {
            name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            portfolio: Math.round(cap[1] / 1000000), // Convert to millions
            profit: volume ? Math.round(volume[1] / 1000000) : 0,
          };
        });

      setData({ barData, lineData, areaData });
    } catch (err) {
      setError(err.message || 'Failed to fetch crypto data');
      console.error('Error fetching crypto data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [cryptoIds, daysMap, timeRange]);

  // Fetch data when time range changes
  useEffect(() => {
    fetchCryptoData();
  }, [fetchCryptoData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchCryptoData,
  };
};
