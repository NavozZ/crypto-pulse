import mongoose from "mongoose";

const forecastPredictionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    coin: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"],
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    predicted_price: {
      type: Number,
      required: true,
    },
    baseline_price: {
      type: Number,
      default: null,
    },
    prediction_type: {
      type: String,
      enum: ["bullish", "bearish"],
      default: "bullish",
    },
    confidence_score: {
      type: Number,
      default: 50,
    },
    actual_price: {
      type: Number,
      default: null,
    },
    actual_direction: {
      type: String,
      enum: ["bullish", "bearish", "unknown"],
      default: "unknown",
    },
    accuracy: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "accurate", "partial", "failed"],
      default: "pending",
    },
    explanation: {
      rsi_condition: { type: String, default: "" },
      macd_signal: { type: String, default: "" },
      sentiment_influence: { type: String, default: "" },
      trend_reasoning: { type: String, default: "" },
      volatility_analysis: { type: String, default: "" },
      summary: { type: String, default: "" },
    },
    source: {
      type: String,
      default: "facebook_prophet",
    },
    forecast_days: {
      type: Number,
      default: 14,
    },
  },
  { timestamps: true }
);

// Compound index for faster queries by coin and date
forecastPredictionSchema.index({ coin: 1, date: -1 });
forecastPredictionSchema.index({ user_id: 1, coin: 1, date: -1 });

const ForecastPrediction = mongoose.model("ForecastPrediction", forecastPredictionSchema);
export default ForecastPrediction;
