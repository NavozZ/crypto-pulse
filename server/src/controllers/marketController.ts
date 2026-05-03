import { Request, Response } from "express";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

// Simple in-memory cache to respect CoinGecko free tier rate limits
// (10-30 calls/min). Cache expires after 15 minutes on production.
interface CacheEntry {
  data: unknown;
  expiry: number;
}
const cache = new Map<string, CacheEntry>();

const getFromCache = (key: string): unknown | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const setCache = (key: string, data: unknown, ttlMs = 15 * 60 * 1000) => {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
};

// ─── GET /api/market/ohlc/:coinId ─────────────────────────────────────────
export const getOHLCData = async (req: Request, res: Response) => {
  const { coinId } = req.params;
  const days = (req.query.days as string) || "30";

  const allowed = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];
  if (!allowed.includes(coinId)) {
    return res.status(400).json({ message: "Invalid coin ID" });
  }

  const cacheKey = `ohlc:${coinId}:${days}`;

  const cached = getFromCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    // ── Fetch OHLC candles ─────────────────────────────────────────
    const ohlcResponse = await fetch(
      `${COINGECKO_BASE}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`,
      { headers: { Accept: "application/json" } }
    );

    if (!ohlcResponse.ok) {
      const status = ohlcResponse.status;
      if (status === 429) {
        return res.status(429).json({ message: "Rate limit reached. Please wait a moment." });
      }
      throw new Error(`CoinGecko OHLC error: ${status}`);
    }

    const rawOhlc = (await ohlcResponse.json()) as number[][];

    const seen = new Set<number>();
    const ohlc = rawOhlc
      .map(([ts, open, high, low, close]) => ({
        time:  Math.floor(ts / 1000),
        open, high, low, close,
      }))
      .filter((point) => {
        if (seen.has(point.time)) return false;
        seen.add(point.time);
        return true;
      })
      .sort((a, b) => a.time - b.time);

    // ── Fetch current price stats ──────────────────────────────────
    const statsResponse = await fetch(
      `${COINGECKO_BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
      { headers: { Accept: "application/json" } }
    );

    let stats = { price: 0, change24h: 0, marketCap: 0, volume24h: 0 };

    if (statsResponse.ok) {
      const statsData = (await statsResponse.json()) as Record<string, Record<string, number>>;
      const coin = statsData[coinId];
      if (coin) {
        stats = {
          price:     coin.usd             ?? 0,
          change24h: coin.usd_24h_change  ?? 0,
          marketCap: coin.usd_market_cap  ?? 0,
          volume24h: coin.usd_24h_vol     ?? 0,
        };
      }
    }

    const result = { ohlc, stats };

    // Cache for 15 minutes to avoid CoinGecko rate limits on production
    setCache(cacheKey, result, 15 * 60 * 1000);

    return res.json(result);

  } catch (error) {
    console.error("❌ Market data error:", (error as Error).message);
    return res.status(500).json({
      message: "Failed to fetch market data",
      error:   (error as Error).message,
    });
  }
};