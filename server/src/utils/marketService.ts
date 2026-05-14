import axios from "axios";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";
const BINANCE_API_BASE = "https://api.binance.com/api/v3";

interface MarketData {
  price: number;
  change_24h: number;
  volume: number;
  source: string;
}

/**
 * Fetch market data from CoinGecko API
 */
export const fetchCoinGeckoData = async (coin: string): Promise<MarketData> => {
  try {
    const url = `${COINGECKO_API_BASE}/coins/${coin}/market_chart?vs_currency=usd&days=1`;

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "CryptoPulse/1.0",
      },
    });

    const data = response.data;

    // Extract latest price
    const prices = data.prices || [];
    const price = prices.length > 0 ? prices[prices.length - 1][1] : null;

    if (!price) {
      throw new Error("No price data available from CoinGecko");
    }

    // Extract 24h change (CoinGecko returns market caps and volumes arrays)
    const volumes = data.volumes || [];
    const volume = volumes.length > 0 ? volumes[volumes.length - 1][1] : 0;

    // Calculate 24h change from first and last prices
    const firstPrice = prices.length > 1 ? prices[0][1] : price;
    const change_24h = ((price - firstPrice) / firstPrice) * 100;

    return {
      price: parseFloat(price.toFixed(2)),
      change_24h: parseFloat(change_24h.toFixed(2)),
      volume: parseFloat(volume.toFixed(0)),
      source: "coingecko",
    };
  } catch (error) {
    const message = (error as any).response?.data?.status?.error_message || (error as Error).message;
    throw new Error(`CoinGecko API Error [${coin}]: ${message}`);
  }
};

/**
 * Fetch market data from Binance API
 */
export const fetchBinanceData = async (symbol: string): Promise<MarketData> => {
  try {
    const url = `${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`;

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "CryptoPulse/1.0",
      },
    });

    const data = response.data;

    // Validate required fields
    if (!data.lastPrice || !data.priceChangePercent || !data.quoteAssetVolume) {
      throw new Error("Missing required fields in Binance response");
    }

    return {
      price: parseFloat(data.lastPrice),
      change_24h: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.quoteAssetVolume),
      source: "binance",
    };
  } catch (error) {
    const message = (error as any).response?.data?.msg || (error as Error).message;
    throw new Error(`Binance API Error [${symbol}]: ${message}`);
  }
};

/**
 * Fetch and compare data from both APIs (useful for redundancy/verification)
 */
export const fetchMultipleSourceData = async (coin: string, symbol: string) => {
  try {
    const [coingeckoData, binanceData] = await Promise.all([
      fetchCoinGeckoData(coin),
      fetchBinanceData(symbol),
    ]);

    return {
      coingecko: coingeckoData,
      binance: binanceData,
    };
  } catch (error) {
    throw new Error(`Multi-source fetch failed: ${(error as Error).message}`);
  }
};
