import { Request, Response } from "express";

const ALLOWED_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];

const getAIEngineURL = () => process.env.AI_ENGINE_URL || "http://localhost:8000";

// Simple in-memory cache — 15 min TTL
interface CacheEntry { data: unknown; expiry: number; }
const cache = new Map<string, CacheEntry>();

// ── GET /api/sentiment/:coinId ─────────────────────────────────────────────
export const getSentiment = async (req: Request, res: Response) => {
  const { coinId } = req.params;

  if (!ALLOWED_COINS.includes(coinId)) {
    return res.status(400).json({ message: "Invalid coin ID" });
  }

  // Return cached result if available
  const cached = cache.get(coinId);
  if (cached && Date.now() < cached.expiry) {
    return res.json(cached.data);
  }

  try {
    const url = `${getAIEngineURL()}/sentiment/${coinId}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(60000) }); // 1 min timeout

    if (!response.ok) {
      const err = await response.json() as { error?: string };
      return res.status(500).json({ message: "AI engine error", error: err.error });
    }

    const data = await response.json();

    // Cache for 15 minutes
    cache.set(coinId, { data, expiry: Date.now() + 15 * 60 * 1000 });

    return res.json(data);

  } catch (error) {
    console.error("❌ Sentiment HTTP error:", (error as Error).message);
    return res.status(500).json({
      message: "Sentiment engine unavailable",
      error:   (error as Error).message,
    });
  }
};
