import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username:  { type: String, required: true, unique: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true },
    profileImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    watchlist: [{ type: String }],
    favoriteCoins: [{ type: String }],
    savedForecasts: [
      {
        coin: { type: String, required: true },
        direction: { type: String, enum: ["bullish", "bearish", "neutral"], required: true },
        confidence: { type: Number, required: true },
        summary: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    notificationPreferences: {
      forecastAlerts: { type: Boolean, default: true },
      sentimentAlerts: { type: Boolean, default: true },
      watchlistAlerts: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
    },
    settings: {
      darkMode: { type: Boolean, default: true },
      timezone: { type: String, default: "UTC" },
    },
    activityHistory: [
      {
        action: { type: String, required: true },
        meta: { type: mongoose.Schema.Types.Mixed, default: {} },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    role: {
      type:    String,
      enum:    ["user", "admin"],
      default: "user",
    },
    // ── Subscription ────────────────────────────────────────────────
    subscription: {
      type:    String,
      enum:    ["free", "pro"],
      default: "free",
    },
    stripeCustomerId:       { type: String, default: null },
    stripePaymentIntentId:  { type: String, default: null },
    subscribedAt:           { type: Date,   default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
