import { Response } from "express";
import { getHistory, getAccuracyStats } from "../utils/forecastHistoryService";
import { AuthRequest } from "../middleware/authMiddleware";

const ALLOWED_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];
const ALLOWED_STATUSES = ["pending", "accurate", "partial", "failed"];
const ALLOWED_DIRECTIONS = ["bullish", "bearish"];

export const getForecastHistory = async (req: AuthRequest, res: Response) => {
  try {
    const {
      coin,
      limit = "12",
      page = "1",
      timeframe,
      direction,
      status,
    } = req.query;

    if (coin && (typeof coin !== "string" || !ALLOWED_COINS.includes(coin.toLowerCase()))) {
      return res.status(400).json({ message: "Invalid coin ID" });
    }

    if (direction && (typeof direction !== "string" || !ALLOWED_DIRECTIONS.includes(direction))) {
      return res.status(400).json({ message: "Invalid direction filter" });
    }

    if (status && (typeof status !== "string" || !ALLOWED_STATUSES.includes(status))) {
      return res.status(400).json({ message: "Invalid status filter" });
    }

    const payload = await getHistory(
      {
        userId: String(req.user?._id || ""),
        coin: typeof coin === "string" ? coin.toLowerCase() : undefined,
        limit: Math.min(50, Math.max(1, parseInt(String(limit), 10) || 12)),
        page: Math.max(1, parseInt(String(page), 10) || 1),
        timeframe: timeframe ? parseInt(String(timeframe), 10) : undefined,
        predictionType: typeof direction === "string" ? (direction as "bullish" | "bearish") : undefined,
        status: typeof status === "string"
          ? (status as "pending" | "accurate" | "partial" | "failed")
          : undefined,
      },
      true
    );

    return res.json(payload);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch forecast history",
      error: (error as Error).message,
    });
  }
};

export const getAccuracyStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const { coin } = req.query;
    if (coin && (typeof coin !== "string" || !ALLOWED_COINS.includes(coin.toLowerCase()))) {
      return res.status(400).json({ message: "Invalid coin ID" });
    }

    const stats = await getAccuracyStats(
      typeof coin === "string" ? coin.toLowerCase() : undefined,
      String(req.user?._id || "")
    );

    return res.json(stats);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch accuracy statistics",
      error: (error as Error).message,
    });
  }
};

