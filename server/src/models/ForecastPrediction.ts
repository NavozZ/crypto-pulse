import mongoose from "mongoose";

const forecastPredictionSchema = new mongoose.Schema(
  {
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
    actual_price: {
      type: Number,
      default: null,
    },
    accuracy: {
      type: Number,
      default: null,
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

const ForecastPrediction = mongoose.model("ForecastPrediction", forecastPredictionSchema);
export default ForecastPrediction;
