/**
 * forecastHistoryService.ts
 * ────────────────────────────────────────────────────────────
 * Service for managing AI forecast predictions and accuracy tracking.
 * Stores predictions, updates actual prices, and calculates accuracy.
 */

import ForecastPrediction from "../models/ForecastPrediction";
import { fetchCoinGeckoData, fetchBinanceData } from "./marketService";

interface Prediction {
  coin: string;
  date: Date;
  predicted_price: number;
  actual_price: number | null;
  accuracy: number | null;
  source: string;
  forecast_days: number;
}

/**
 * Save a new prediction when AI generates a forecast
 * Called after Prophet generates predictions for today
 */
export const savePrediction = async (
  coin: string,
  predicted_price: number,
  forecastDays: number = 14,
  source: string = "facebook_prophet"
): Promise<Prediction> => {
  try {
    const prediction = await ForecastPrediction.create({
      coin: coin.toLowerCase(),
      date: new Date(),
      predicted_price: Math.round(predicted_price * 100) / 100,
      actual_price: null,
      accuracy: null,
      source,
      forecast_days: forecastDays,
    });

    console.log(`✅ Saved forecast for ${coin}: $${predicted_price}`);
    return prediction.toObject();
  } catch (error) {
    console.error(`❌ Error saving prediction for ${coin}:`, (error as Error).message);
    throw new Error(`Failed to save prediction: ${(error as Error).message}`);
  }
};

/**
 * Calculate accuracy of a prediction
 * Formula: accuracy = (1 - abs(predicted - actual) / actual) * 100
 */
const calculateAccuracy = (predicted: number, actual: number): number => {
  if (actual === 0) return 0;
  const error = Math.abs(predicted - actual);
  const accuracy = (1 - error / actual) * 100;
  return Math.round(accuracy * 100) / 100; // Round to 2 decimals
};

/**
 * Fetch current market price from external API
 */
const fetchCurrentPrice = async (coin: string): Promise<number> => {
  try {
    // Try CoinGecko first
    const data = await fetchCoinGeckoData(coin);
    return data.price;
  } catch (error) {
    console.warn(`⚠️ CoinGecko failed for ${coin}, trying Binance fallback`);

    // Fallback to Binance
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

/**
 * Update actual price and calculate accuracy for a prediction
 * Called daily or when checking historical accuracy
 */
export const updateActualPriceAndAccuracy = async (
  coin: string,
  actualPrice?: number
): Promise<Prediction | null> => {
  try {
    // Get the latest prediction for this coin
    const prediction = await ForecastPrediction.findOne({
      coin: coin.toLowerCase(),
    }).sort({ date: -1 });

    if (!prediction) {
      console.warn(`⚠️ No prediction found for ${coin}`);
      return null;
    }

    // Skip if already has actual price and accuracy
    if (prediction.actual_price !== null && prediction.accuracy !== null) {
      return prediction.toObject();
    }

    // Fetch current price if not provided
    let price = actualPrice;
    if (!price) {
      price = await fetchCurrentPrice(coin);
    }

    // Calculate accuracy
    const accuracy = calculateAccuracy(prediction.predicted_price, price);

    // Update prediction with actual price and accuracy
    prediction.actual_price = Math.round(price * 100) / 100;
    prediction.accuracy = accuracy;
    await prediction.save();

    console.log(
      `✅ Updated ${coin} accuracy: ${accuracy}% (Predicted: $${prediction.predicted_price}, Actual: $${price})`
    );

    return prediction.toObject();
  } catch (error) {
    console.error(`❌ Error updating accuracy for ${coin}:`, (error as Error).message);
    throw new Error(`Failed to update accuracy: ${(error as Error).message}`);
  }
};

/**
 * Get forecast history for a coin with accuracy metrics
 * If actual_price is missing, fetch from API and calculate accuracy
 */
export const getHistory = async (
  coin: string,
  limit: number = 30,
  fetchMissingPrices: boolean = true
): Promise<Prediction[]> => {
  try {
    const predictions = await ForecastPrediction.find({
      coin: coin.toLowerCase(),
    })
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    if (fetchMissingPrices) {
      // Update any predictions missing actual prices
      for (const pred of predictions) {
        if (pred.actual_price === null || pred.accuracy === null) {
          try {
            const currentPrice = await fetchCurrentPrice(coin);
            const accuracy = calculateAccuracy(pred.predicted_price, currentPrice);

            // Update in database
            await ForecastPrediction.updateOne(
              { _id: pred._id },
              {
                actual_price: Math.round(currentPrice * 100) / 100,
                accuracy: accuracy,
              }
            );

            // Update local object
            pred.actual_price = currentPrice;
            pred.accuracy = accuracy;
          } catch (err) {
            console.warn(
              `⚠️ Could not fetch price for ${coin}:`,
              (err as Error).message
            );
            // Continue with incomplete data
          }
        }
      }
    }

    return predictions.map((pred) => ({
      coin: pred.coin,
      date: pred.date,
      predicted_price: pred.predicted_price,
      actual_price: pred.actual_price,
      accuracy: pred.accuracy,
      source: pred.source,
      forecast_days: pred.forecast_days,
    }));
  } catch (error) {
    console.error(`❌ Error fetching history for ${coin}:`, (error as Error).message);
    throw new Error(`Failed to fetch forecast history: ${(error as Error).message}`);
  }
};

/**
 * Get accuracy statistics for a coin (average, best, worst)
 */
export const getAccuracyStats = async (coin: string): Promise<any> => {
  try {
    const stats = await ForecastPrediction.aggregate([
      {
        $match: {
          coin: coin.toLowerCase(),
          accuracy: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$coin",
          average_accuracy: { $avg: "$accuracy" },
          best_accuracy: { $max: "$accuracy" },
          worst_accuracy: { $min: "$accuracy" },
          total_predictions: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        average_accuracy: 0,
        best_accuracy: 0,
        worst_accuracy: 0,
        total_predictions: 0,
      };
    }

    const result = stats[0];
    return {
      average_accuracy: Math.round(result.average_accuracy * 100) / 100,
      best_accuracy: Math.round(result.best_accuracy * 100) / 100,
      worst_accuracy: Math.round(result.worst_accuracy * 100) / 100,
      total_predictions: result.total_predictions,
    };
  } catch (error) {
    console.error(`❌ Error calculating accuracy stats for ${coin}:`, (error as Error).message);
    throw new Error(`Failed to calculate accuracy stats: ${(error as Error).message}`);
  }
};
