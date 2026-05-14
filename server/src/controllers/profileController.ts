import { Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";
import { appendUserActivity } from "../utils/userActivity";

const ALLOWED_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];

const sanitizeUser = (user: any) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  subscription: user.subscription,
  profileImage: user.profileImage || "",
  bio: user.bio || "",
  watchlist: user.watchlist || [],
  favoriteCoins: user.favoriteCoins || [],
  savedForecasts: user.savedForecasts || [],
  notificationPreferences: user.notificationPreferences,
  settings: user.settings,
  activityHistory: (user.activityHistory || []).slice(-50).reverse(),
  createdAt: user.createdAt,
});

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(sanitizeUser(user));
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load profile",
      error: (error as Error).message,
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      username,
      email,
      bio,
      profileImage,
      favoriteCoins,
      notificationPreferences,
      settings,
    } = req.body;

    if (username && username !== user.username) {
      const exists = await User.findOne({ username, _id: { $ne: user._id } });
      if (exists) {
        return res.status(400).json({ message: "Username already in use" });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const exists = await User.findOne({ email, _id: { $ne: user._id } });
      if (exists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = String(email).toLowerCase();
    }

    if (typeof bio === "string") {
      user.bio = bio.slice(0, 280);
    }

    if (typeof profileImage === "string") {
      user.profileImage = profileImage.trim();
    }

    if (Array.isArray(favoriteCoins)) {
      const cleaned = [...new Set(favoriteCoins.map((coin) => String(coin).toLowerCase()))]
        .filter((coin) => ALLOWED_COINS.includes(coin));
      user.favoriteCoins = cleaned;
    }

    if (notificationPreferences && typeof notificationPreferences === "object") {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences,
      };
    }

    if (settings && typeof settings === "object") {
      user.settings = {
        ...user.settings,
        ...settings,
      };
    }

    await user.save();
    await appendUserActivity(String(user._id), "profile_updated");

    return res.json({
      message: "Profile updated",
      profile: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile",
      error: (error as Error).message,
    });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(String(currentPassword), user.password);
    if (!valid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(String(newPassword), salt);
    await user.save();
    await appendUserActivity(String(user._id), "password_changed");

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update password",
      error: (error as Error).message,
    });
  }
};

export const saveForecastToProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { coin, direction, confidence, summary } = req.body;
    if (!coin || !direction || confidence === undefined || !summary) {
      return res.status(400).json({ message: "coin, direction, confidence and summary are required" });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedForecasts.unshift({
      coin: String(coin).toLowerCase(),
      direction,
      confidence: Number(confidence),
      summary: String(summary),
      createdAt: new Date(),
    });

    if (user.savedForecasts.length > 100) {
      user.savedForecasts.splice(100);
    }

    await user.save();
    await appendUserActivity(String(user._id), "forecast_saved", { coin, direction });

    return res.json({
      message: "Forecast saved",
      savedForecasts: user.savedForecasts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to save forecast",
      error: (error as Error).message,
    });
  }
};

export const removeSavedForecast = async (req: AuthRequest, res: Response) => {
  try {
    const { forecastId } = req.params;
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = user.savedForecasts.id(forecastId);
    if (existing) {
      existing.deleteOne();
    }
    await user.save();
    await appendUserActivity(String(user._id), "forecast_removed", { forecastId });

    return res.json({
      message: "Saved forecast removed",
      savedForecasts: user.savedForecasts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove saved forecast",
      error: (error as Error).message,
    });
  }
};

