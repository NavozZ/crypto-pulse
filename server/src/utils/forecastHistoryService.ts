import ForecastPrediction from "../models/ForecastPrediction";
import { fetchCoinGeckoData, fetchBinanceData } from "./marketService";

interface SavePredictionOptions {
  coin: string;
  predictedPrice: number;
  forecastDays?: number;
  source?: string;
  userId?: string;
  baselinePrice?: number | null;
  predictionType?: "bullish" | "bearish";
  confidenceScore?: number;
  explanation?: {
    rsi_condition?: string;
    macd_signal?: string;
    sentiment_influence?: string;
    trend_reasoning?: string;
    volatility_analysis?: string;
    summary?: string;
  };
}

interface HistoryFilters {
  userId?: string;
  coin?: string;
  limit?: number;
  page?: number;
  timeframe?: number;
  predictionType?: "bullish" | "bearish";
  status?: "pending" | "accurate" | "partial" | "failed";
}

const calculateAccuracy = (predicted: number, actual: number): number => {
  if (actual === 0) return 0;
  const error = Math.abs(predicted - actual);
  const accuracy = (1 - error / actual) * 100;
  return Math.round(accuracy * 100) / 100;
};

const deriveStatus = (accuracy: number | null) => {
  if (accuracy === null) return "pending";
  if (accuracy >= 95) return "accurate";
  if (accuracy >= 85) return "partial";
  return "failed";
};

const deriveActualDirection = (actualPrice: number, baselinePrice: number | null) => {
  if (!baselinePrice || baselinePrice <= 0) return "unknown";
  return actualPrice >= baselinePrice ? "bullish" : "bearish";
};

const fetchCurrentPrice = async (coin: string): Promise<number> => {
  try {
    const data = await fetchCoinGeckoData(coin);
    return data.price;
  } catch {
    const coinToBinanceMap: Record<string, string> = {
      bitcoin: "BTCUSDT",
      ethereum: "ETHUSDT",
      solana: "SOLUSDT",
      binancecoin: "BNBUSDT",
      ripple: "XRPUSDT",
      cardano: "ADAUSDT",
    };
    const binanceSymbol = coinToBinanceMap[coin.toLowerCase()];
    if (!binanceSymbol) {
      throw new Error(`No Binance mapping for coin: ${coin}`);
    }
    const data = await fetchBinanceData(binanceSymbol);
    return data.price;
  }
};

export const savePrediction = async ({
  coin,
  predictedPrice,
  forecastDays = 14,
  source = "facebook_prophet",
  userId,
  baselinePrice = null,
  predictionType = "bullish",
  confidenceScore = 50,
  explanation,
}: SavePredictionOptions) => {
  const prediction = await ForecastPrediction.create({
    user_id: userId || null,
    coin: coin.toLowerCase(),
    date: new Date(),
    predicted_price: Math.round(predictedPrice * 100) / 100,
    baseline_price: baselinePrice,
    prediction_type: predictionType,
    confidence_score: Math.max(1, Math.min(99, Math.round(confidenceScore))),
    actual_price: null,
    actual_direction: "unknown",
    status: "pending",
    accuracy: null,
    source,
    forecast_days: forecastDays,
    explanation: explanation || {},
  });

  return prediction.toObject();
};

export const updateActualPriceAndAccuracy = async (
  predictionId: string,
  coin: string,
  actualPrice?: number
) => {
  const prediction = await ForecastPrediction.findById(predictionId);
  if (!prediction) return null;

  const price = actualPrice || (await fetchCurrentPrice(coin));
  const accuracy = calculateAccuracy(prediction.predicted_price, price);
  const status = deriveStatus(accuracy);
  const actualDirection = deriveActualDirection(price, prediction.baseline_price);

  prediction.actual_price = Math.round(price * 100) / 100;
  prediction.accuracy = accuracy;
  prediction.status = status;
  prediction.actual_direction = actualDirection;
  await prediction.save();
  return prediction.toObject();
};

export const getHistory = async (filters: HistoryFilters, fetchMissingPrices = true) => {
  const {
    userId,
    coin,
    limit = 12,
    page = 1,
    timeframe,
    predictionType,
    status,
  } = filters;

  const query: any = {};
  if (coin) query.coin = coin.toLowerCase();
  if (userId) query.user_id = userId;
  if (predictionType) query.prediction_type = predictionType;
  if (status) query.status = status;
  if (timeframe && Number.isFinite(timeframe)) query.forecast_days = Number(timeframe);

  const skip = Math.max(0, (page - 1) * limit);
  const [total, predictions] = await Promise.all([
    ForecastPrediction.countDocuments(query),
    ForecastPrediction.find(query).sort({ date: -1 }).skip(skip).limit(limit).lean(),
  ]);

  if (fetchMissingPrices) {
    for (const pred of predictions) {
      if (pred.actual_price === null || pred.accuracy === null) {
        const currentPrice = await fetchCurrentPrice(pred.coin);
        const accuracy = calculateAccuracy(pred.predicted_price, currentPrice);
        const statusValue = deriveStatus(accuracy);
        const actualDirection = deriveActualDirection(currentPrice, pred.baseline_price);

        await ForecastPrediction.updateOne(
          { _id: pred._id },
          {
            actual_price: Math.round(currentPrice * 100) / 100,
            accuracy,
            status: statusValue,
            actual_direction: actualDirection,
          }
        );

        pred.actual_price = currentPrice;
        pred.accuracy = accuracy;
        pred.status = statusValue;
        pred.actual_direction = actualDirection;
      }
    }
  }

  return {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    history: predictions,
    trend: predictions
      .slice()
      .reverse()
      .map((pred) => ({
        date: pred.date,
        accuracy: pred.accuracy,
        confidence: pred.confidence_score,
      })),
  };
};

export const getAccuracyStats = async (coin?: string, userId?: string) => {
  const match: any = { accuracy: { $ne: null } };
  if (coin) match.coin = coin.toLowerCase();
  if (userId) match.user_id = userId;

  const stats = await ForecastPrediction.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        average_accuracy: { $avg: "$accuracy" },
        best_accuracy: { $max: "$accuracy" },
        worst_accuracy: { $min: "$accuracy" },
        average_confidence: { $avg: "$confidence_score" },
        total_predictions: { $sum: 1 },
        accurate_count: {
          $sum: { $cond: [{ $eq: ["$status", "accurate"] }, 1, 0] },
        },
        partial_count: {
          $sum: { $cond: [{ $eq: ["$status", "partial"] }, 1, 0] },
        },
        failed_count: {
          $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
        },
      },
    },
  ]);

  if (stats.length === 0) {
    return {
      average_accuracy: 0,
      best_accuracy: 0,
      worst_accuracy: 0,
      average_confidence: 0,
      total_predictions: 0,
      accurate_count: 0,
      partial_count: 0,
      failed_count: 0,
    };
  }

  const result = stats[0];
  return {
    average_accuracy: Math.round(result.average_accuracy * 100) / 100,
    best_accuracy: Math.round(result.best_accuracy * 100) / 100,
    worst_accuracy: Math.round(result.worst_accuracy * 100) / 100,
    average_confidence: Math.round(result.average_confidence * 100) / 100,
    total_predictions: result.total_predictions,
    accurate_count: result.accurate_count,
    partial_count: result.partial_count,
    failed_count: result.failed_count,
  };
};

