/**
 * forecastHistoryController.ts
 * ────────────────────────────────────────────────────────────
 * Controller for forecast history endpoints
 * GET /api/forecast-history?coin=bitcoin - Get prediction history
 * GET /api/forecast-history/stats?coin=bitcoin - Get accuracy statistics
 */

import { Request, Response } from "express";
import { getHistory, getAccuracyStats } from "../utils/forecastHistoryService";

const ALLOWED_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];

// ── GET /api/forecast-history?coin=bitcoin ─────────────────────────────────
export const getForecastHistory = async (req: Request, res: Response) => {
  try {
    const { coin, limit } = req.query;

    // Validate coin parameter
    if (!coin || typeof coin !== "string") {
      return res.status(400).json({ message: "Missing or invalid 'coin' query parameter" });
    }

    if (!ALLOWED_COINS.includes(coin.toLowerCase())) {
      return res.status(400).json({ message: "Invalid coin ID" });
    }

    // Parse limit (default 30, max 365)
    let limitNum = 30;
    if (limit) {
      limitNum = Math.min(parseInt(limit as string) || 30, 365);
    }

    // Get history with automatic accuracy updates
    const history = await getHistory(coin.toLowerCase(), limitNum, true);

    return res.json({
      coin: coin.toLowerCase(),
      total: history.length,
      history: history,
    });
  } catch (error) {
    console.error("❌ Forecast history error:", (error as Error).message);
    return res.status(500).json({
      message: "Failed to fetch forecast history",
      error: (error as Error).message,
    });
  }
};

// ── GET /api/forecast-history/stats?coin=bitcoin ────────────────────────────
export const getAccuracyStatistics = async (req: Request, res: Response) => {
  try {
    const { coin } = req.query;

    // Validate coin parameter
    if (!coin || typeof coin !== "string") {
      return res.status(400).json({ message: "Missing or invalid 'coin' query parameter" });
    }

    if (!ALLOWED_COINS.includes(coin.toLowerCase())) {
      return res.status(400).json({ message: "Invalid coin ID" });
    }

    // Get accuracy statistics
    const stats = await getAccuracyStats(coin.toLowerCase());

    return res.json({
      coin: coin.toLowerCase(),
      ...stats,
    });
  } catch (error) {
    console.error("❌ Accuracy stats error:", (error as Error).message);
    return res.status(500).json({
      message: "Failed to fetch accuracy statistics",
      error: (error as Error).message,
    });
  }
};
