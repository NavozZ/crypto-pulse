import { Request, Response } from "express";
import { savePrediction } from "../utils/forecastHistoryService";
import { fetchCoinGeckoData } from "../utils/marketService";

const ALLOWED_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];

const getAIEngineURL = () => process.env.AI_ENGINE_URL || "http://localhost:8000";

const calculateEMA = (values: number[], period: number) => {
  if (values.length === 0) return [];
  const multiplier = 2 / (period + 1);
  const ema: number[] = [values[0]];
  for (let i = 1; i < values.length; i += 1) {
    ema.push((values[i] - ema[i - 1]) * multiplier + ema[i - 1]);
  }
  return ema;
};

const calculateRSI = (closes: number[], period = 14) => {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i += 1) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period || 0.0001;
  const rs = avgGain / avgLoss;
  return Math.round((100 - 100 / (1 + rs)) * 100) / 100;
};

const calculateMACDSignal = (closes: number[]) => {
  if (closes.length < 26) return "Insufficient MACD data";
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  const macd = ema12.map((value, index) => value - (ema26[index] || value));
  const signalLine = calculateEMA(macd, 9);
  const lastMacd = macd[macd.length - 1] || 0;
  const lastSignal = signalLine[signalLine.length - 1] || 0;
  return lastMacd >= lastSignal ? "MACD bullish crossover" : "MACD bearish crossover";
};

const calculateVolatilityPercent = (closes: number[]) => {
  if (closes.length < 10) return 0;
  const recent = closes.slice(-10);
  const mean = recent.reduce((sum, value) => sum + value, 0) / recent.length;
  const variance = recent.reduce((sum, value) => sum + (value - mean) ** 2, 0) / recent.length;
  const stdDev = Math.sqrt(variance);
  return Math.round(((stdDev / mean) * 100) * 100) / 100;
};

const scoreConfidence = (forecastPoint: any, volatility: number, sentimentCompound: number) => {
  const yhat = Math.max(1, Number(forecastPoint?.yhat || 1));
  const width = Math.max(0, Number(forecastPoint?.yhat_upper || yhat) - Number(forecastPoint?.yhat_lower || yhat));
  const bandPenalty = Math.min(30, (width / yhat) * 100);
  const volatilityPenalty = Math.min(25, volatility * 0.7);
  const sentimentBoost = Math.min(12, Math.abs(sentimentCompound || 0) * 18);
  const confidence = 82 - bandPenalty - volatilityPenalty + sentimentBoost;
  return Math.max(15, Math.min(98, Math.round(confidence)));
};

const fetchOHLCCloses = async (coinId: string) => {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=30`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Failed to fetch OHLC with status ${response.status}`);
  }
  const raw = await response.json() as number[][];
  return raw.map((row) => row[4]).filter((value) => Number.isFinite(value));
};

const createExplanationPayload = (
  direction: "bullish" | "bearish",
  rsi: number,
  macdSignal: string,
  sentimentLabel: string,
  volatility: number
) => {
  const rsiCondition = rsi <= 35
    ? `RSI at ${rsi} suggests oversold recovery potential`
    : rsi >= 70
      ? `RSI at ${rsi} signals overbought pressure`
      : `RSI at ${rsi} is neutral, supporting trend continuation`;

  const trendReasoning = direction === "bullish"
    ? "Forecast slope projects higher highs over the forecast window."
    : "Forecast slope projects lower highs and downside continuation.";

  const volatilityAnalysis = volatility > 8
    ? `High volatility (${volatility}%) increases uncertainty in near-term price action.`
    : `Moderate volatility (${volatility}%) supports cleaner directional moves.`;

  const summary = [
    `Prediction: ${direction === "bullish" ? "Bullish" : "Bearish"}`,
    rsiCondition,
    macdSignal,
    `Sentiment influence: ${sentimentLabel}`,
    trendReasoning,
  ].join(" ");

  return {
    rsi_condition: rsiCondition,
    macd_signal: macdSignal,
    sentiment_influence: `Social sentiment currently reads ${sentimentLabel.toLowerCase()}.`,
    trend_reasoning: trendReasoning,
    volatility_analysis: volatilityAnalysis,
    summary,
  };
};

export const getForecast = async (req: Request, res: Response) => {
  const { coinId } = req.params;
  const days = (req.query.days as string) || "90";

  if (!ALLOWED_COINS.includes(coinId)) {
    return res.status(400).json({ message: "Invalid coin ID" });
  }

  try {
    const [forecastResponse, marketData, closes, sentimentResponse] = await Promise.all([
      fetch(`${getAIEngineURL()}/forecast/${coinId}?days=${days}`, { signal: AbortSignal.timeout(120000) }),
      fetchCoinGeckoData(coinId),
      fetchOHLCCloses(coinId),
      fetch(`${getAIEngineURL()}/sentiment/${coinId}`, { signal: AbortSignal.timeout(30000) }),
    ]);

    if (!forecastResponse.ok) {
      const err = await forecastResponse.json() as { error?: string };
      return res.status(500).json({ message: "AI engine error", error: err.error });
    }

    const data = await forecastResponse.json() as any;
    const sentimentData = sentimentResponse.ok ? await sentimentResponse.json() as any : { compound: 0, label: "Neutral" };

    if (data.forecast && data.forecast.length > 0) {
      const firstPrediction = data.forecast[0];
      const lastPrediction = data.forecast[data.forecast.length - 1];
      const direction = Number(lastPrediction?.yhat || 0) >= Number(firstPrediction?.yhat || 0) ? "bullish" : "bearish";
      const rsi = calculateRSI(closes);
      const macdSignal = calculateMACDSignal(closes);
      const volatility = calculateVolatilityPercent(closes);
      const confidenceScore = scoreConfidence(firstPrediction, volatility, sentimentData.compound || 0);
      const explanation = createExplanationPayload(
        direction,
        rsi,
        macdSignal,
        sentimentData.label || "Neutral",
        volatility
      );

      await savePrediction({
        coin: coinId,
        predictedPrice: Number(firstPrediction.yhat || 0),
        forecastDays: data.forecast_days || 14,
        source: data.model || "facebook_prophet",
        userId: String((req as any).user?._id || ""),
        baselinePrice: marketData.price,
        predictionType: direction,
        confidenceScore,
        explanation,
      });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Forecast engine unavailable",
      error: (error as Error).message,
    });
  }
};

export const getForecastExplanation = async (req: Request, res: Response) => {
  const { coinId } = req.params;
  if (!ALLOWED_COINS.includes(coinId)) {
    return res.status(400).json({ message: "Invalid coin ID" });
  }

  try {
    const [forecastResponse, closes, sentimentResponse] = await Promise.all([
      fetch(`${getAIEngineURL()}/forecast/${coinId}?days=30`, { signal: AbortSignal.timeout(120000) }),
      fetchOHLCCloses(coinId),
      fetch(`${getAIEngineURL()}/sentiment/${coinId}`, { signal: AbortSignal.timeout(30000) }),
    ]);

    if (!forecastResponse.ok) {
      return res.status(502).json({ message: "Forecast engine unavailable for explanation" });
    }

    const forecastData = await forecastResponse.json() as any;
    const sentimentData = sentimentResponse.ok
      ? await sentimentResponse.json() as any
      : { compound: 0, label: "Neutral" };

    const first = forecastData.forecast?.[0];
    const last = forecastData.forecast?.[forecastData.forecast.length - 1];
    const direction: "bullish" | "bearish" =
      Number(last?.yhat || 0) >= Number(first?.yhat || 0) ? "bullish" : "bearish";

    const rsi = calculateRSI(closes);
    const macdSignal = calculateMACDSignal(closes);
    const volatility = calculateVolatilityPercent(closes);
    const confidence = scoreConfidence(first, volatility, sentimentData.compound || 0);
    const explanation = createExplanationPayload(
      direction,
      rsi,
      macdSignal,
      sentimentData.label || "Neutral",
      volatility
    );

    return res.json({
      coin: coinId,
      prediction: direction,
      confidence,
      reasoning: explanation,
      indicators: {
        rsi,
        macdSignal,
        sentimentLabel: sentimentData.label || "Neutral",
        sentimentScore: sentimentData.compound || 0,
        volatility,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate AI explanation",
      error: (error as Error).message,
    });
  }
};

