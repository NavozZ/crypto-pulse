import { Request, Response } from "express";

const ALLOWED_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];

// AI Engine URL — set AI_ENGINE_URL in Render environment variables
const getAIEngineURL = () => process.env.AI_ENGINE_URL || "http://localhost:8000";

// ── GET /api/forecast/:coinId ──────────────────────────────────────────────
export const getForecast = async (req: Request, res: Response) => {
  const { coinId } = req.params;
  const days = (req.query.days as string) || "90";

  if (!ALLOWED_COINS.includes(coinId)) {
    return res.status(400).json({ message: "Invalid coin ID" });
  }

  try {
    const url = `${getAIEngineURL()}/forecast/${coinId}?days=${days}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(120000) }); // 2 min timeout

    if (!response.ok) {
      const err = await response.json() as { error?: string };
      return res.status(500).json({ message: "AI engine error", error: err.error });
    }

    const data = await response.json();
    return res.json(data);

  } catch (error) {
    console.error("❌ Forecast HTTP error:", (error as Error).message);
    return res.status(500).json({
      message: "Forecast engine unavailable",
      error:   (error as Error).message,
    });
  }
};
