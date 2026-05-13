import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";
import { appendUserActivity } from "../utils/userActivity";

const ALLOWED_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];

const normalizeCoins = (coins: unknown): string[] => {
  if (!Array.isArray(coins)) return [];
  return [...new Set(coins.map((coin) => String(coin).toLowerCase()))]
    .filter((coin) => ALLOWED_COINS.includes(coin));
};

const fetchWatchlistPrices = async (coins: string[]) => {
  if (coins.length === 0) return {};
  const ids = coins.join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`CoinGecko price fetch failed with status ${response.status}`);
  }
  return response.json();
};

export const getWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select("watchlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ watchlist: user.watchlist || [] });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load watchlist",
      error: (error as Error).message,
    });
  }
};

export const addToWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const { coin } = req.body;
    const normalized = String(coin || "").toLowerCase();
    if (!ALLOWED_COINS.includes(normalized)) {
      return res.status(400).json({ message: "Invalid coin ID" });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.watchlist.includes(normalized)) {
      user.watchlist.push(normalized);
      await user.save();
      await appendUserActivity(String(user._id), "watchlist_coin_added", { coin: normalized });
    }

    return res.json({ watchlist: user.watchlist });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add coin to watchlist",
      error: (error as Error).message,
    });
  }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const { coinId } = req.params;
    const normalized = String(coinId).toLowerCase();
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist = user.watchlist.filter((coin: string) => coin !== normalized);
    await user.save();
    await appendUserActivity(String(user._id), "watchlist_coin_removed", { coin: normalized });

    return res.json({ watchlist: user.watchlist });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove coin from watchlist",
      error: (error as Error).message,
    });
  }
};

export const reorderWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const orderedCoins = normalizeCoins(req.body.watchlist);
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist = orderedCoins;
    await user.save();
    await appendUserActivity(String(user._id), "watchlist_reordered", { total: orderedCoins.length });

    return res.json({ watchlist: user.watchlist });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to reorder watchlist",
      error: (error as Error).message,
    });
  }
};

export const getWatchlistWithPrices = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select("watchlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const watchlist = user.watchlist || [];
    const prices = await fetchWatchlistPrices(watchlist);
    return res.json({ watchlist, prices });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch watchlist prices",
      error: (error as Error).message,
    });
  }
};

