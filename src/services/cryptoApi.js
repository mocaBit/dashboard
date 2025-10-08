const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export const getCryptoData = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error('Error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
