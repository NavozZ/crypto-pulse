import { Request, Response } from "express";
import path from "path";
import { runPythonScript } from "./forecastController";

const AI_ENGINE_PATH = path.join(__dirname, "../../../ai-engine");
const PYTHON_SCRIPT  = path.join(AI_ENGINE_PATH, "vader_sentiment.py");

const ALLOWED_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];

// Simple in-memory cache — sentiment doesn't need to refresh every request
// VADER scoring over Reddit/Twitter takes ~5-10 seconds, so we cache for 15 mins
interface CacheEntry { data: unknown; expiry: number; }
const cache = new Map<string, CacheEntry>();

// ── GET /api/sentiment/:coinId ─────────────────────────────────────────────
export const getSentiment = async (req: Request, res: Response) => {
  const { coinId } = req.params;

  if (!ALLOWED_COINS.includes(coinId)) {
    return res.status(400).json({ message: "Invalid coin ID" });
  }

  // Return cached result if available (15 min TTL)
  const cached = cache.get(coinId);
  if (cached && Date.now() < cached.expiry) {
    return res.json(cached.data);
  }

  try {
    const result = await runPythonScript(PYTHON_SCRIPT, [coinId]);

    // Cache for 15 minutes
    cache.set(coinId, { data: result, expiry: Date.now() + 15 * 60 * 1000 });

    return res.json(result);
  } catch (error) {
    console.error("❌ VADER sentiment error:", (error as Error).message);
    return res.status(500).json({
      message: "Sentiment engine error",
      error:   (error as Error).message,
    });
  }
};
