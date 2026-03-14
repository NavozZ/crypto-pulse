import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Activity, BarChart2 } from "lucide-react";

// ── Technical Calculation Functions ───────────────────────────────────────

// Simple Moving Average
const sma = (data, period) => {
  if (data.length < period) return null;
  const slice = data.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
};

// Exponential Moving Average
const ema = (data, period) => {
  if (data.length < period) return null;
  const k = 2 / (period + 1);
  let result = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < data.length; i++) {
    result = data[i] * k + result * (1 - k);
  }
  return result;
};

// RSI (14-period)
const calcRSI = (closes, period = 14) => {
  if (closes.length < period + 1) return null;
  const recent = closes.slice(-(period + 1));
  let gains = 0, losses = 0;
  for (let i = 1; i < recent.length; i++) {
    const diff = recent[i] - recent[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
};

// MACD (12, 26, 9)
const calcMACD = (closes) => {
  if (closes.length < 26) return null;
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  if (!ema12 || !ema26) return null;
  return ema12 - ema26;
};

// Stochastic %K (14-period)
const calcStoch = (ohlcData, period = 14) => {
  if (ohlcData.length < period) return null;
  const recent = ohlcData.slice(-period);
  const highestHigh = Math.max(...recent.map(d => d.high));
  const lowestLow   = Math.min(...recent.map(d => d.low));
  const currentClose = ohlcData.at(-1).close;
  if (highestHigh === lowestLow) return 50;
  return ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
};

// Support & Resistance levels (pivot points method)
const calcSR = (ohlcData) => {
  if (ohlcData.length < 20) return { support: [], resistance: [] };
  const recent = ohlcData.slice(-20);
  const support    = [];
  const resistance = [];

  for (let i = 2; i < recent.length - 2; i++) {
    const c = recent[i];
    // Local low → support
    if (c.low < recent[i-1].low && c.low < recent[i-2].low &&
        c.low < recent[i+1].low && c.low < recent[i+2].low) {
      support.push(parseFloat(c.low.toFixed(2)));
    }
    // Local high → resistance
    if (c.high > recent[i-1].high && c.high > recent[i-2].high &&
        c.high > recent[i+1].high && c.high > recent[i+2].high) {
      resistance.push(parseFloat(c.high.toFixed(2)));
    }
  }
  return {
    support:    [...new Set(support)].slice(-2),
    resistance: [...new Set(resistance)].slice(-2),
  };
};

// ── Signal Logic ───────────────────────────────────────────────────────────
const getSignal = (rsi, macd, stoch, price, ma50, ma200) => {
  let bullish = 0, bearish = 0;
  if (rsi !== null) {
    if (rsi < 35)      bullish++;
    else if (rsi > 65) bearish++;
  }
  if (macd !== null) {
    if (macd > 0) bullish++;
    else          bearish++;
  }
  if (stoch !== null) {
    if (stoch < 25)      bullish++;
    else if (stoch > 75) bearish++;
  }
  if (ma50 && price > ma50)   bullish++;
  if (ma200 && price > ma200) bullish++;
  if (ma50 && price < ma50)   bearish++;
  if (ma200 && price < ma200) bearish++;

  if      (bullish >= 3) return { label: "Strong Buy",  color: "#4ade80", bg: "bg-green-500/15",  border: "border-green-500/40",  icon: TrendingUp,   score: bullish };
  else if (bullish === 2) return { label: "Buy",         color: "#86efac", bg: "bg-green-500/10",  border: "border-green-500/30",  icon: TrendingUp,   score: bullish };
  else if (bearish >= 3) return { label: "Strong Sell", color: "#f87171", bg: "bg-red-500/15",    border: "border-red-500/40",    icon: TrendingDown, score: bearish };
  else if (bearish === 2) return { label: "Sell",        color: "#fca5a5", bg: "bg-red-500/10",    border: "border-red-500/30",    icon: TrendingDown, score: bearish };
  else                   return { label: "Neutral",     color: "#facc15", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: Minus,        score: 0       };
};

// ── RSI Bar ────────────────────────────────────────────────────────────────
const RSIBar = ({ value }) => {
  if (value === null) return <div className="h-2 bg-white/10 rounded animate-pulse" />;
  const pct   = Math.min(100, Math.max(0, value));
  const color = value < 30 ? "#4ade80" : value > 70 ? "#f87171" : "#a855f7";
  const label = value < 30 ? "Oversold" : value > 70 ? "Overbought" : "Neutral";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">0</span>
        <span style={{ color }} className="font-semibold">{value.toFixed(1)} — {label}</span>
        <span className="text-gray-500">100</span>
      </div>
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-red-500/30 w-[30%] rounded-l-full" />
        <div className="absolute right-0 top-0 h-full bg-green-500/30 w-[30%] rounded-r-full" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export const useTechnicals = (ohlcData) => {
  return useMemo(() => {
    if (!ohlcData || ohlcData.length < 15) return null;
    const closes = ohlcData.map(d => d.close);
    const price  = closes.at(-1);
    const rsi    = calcRSI(closes);
    const macd   = calcMACD(closes);
    const stoch  = calcStoch(ohlcData);
    const ma50   = sma(closes, Math.min(50,  closes.length));
    const ma200  = sma(closes, Math.min(200, closes.length));
    const sr     = calcSR(ohlcData);
    const signal = getSignal(rsi, macd, stoch, price, ma50, ma200);
    return { rsi, macd, stoch, ma50, ma200, price, sr, signal };
  }, [ohlcData]);
};

const TechnicalIndicators = ({ ohlcData, asset }) => {
  const tech = useTechnicals(ohlcData);

  if (!tech) return (
    <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-4 animate-pulse h-48" />
  );

  const { rsi, macd, stoch, ma50, ma200, price, sr, signal } = tech;
  const SignalIcon = signal.icon;
  const fmt = (v) => v ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—";

  const rows = [
    { label: "RSI (14)",     value: rsi   !== null ? rsi.toFixed(2)   : "—", unit: "",  note: rsi < 30 ? "Oversold" : rsi > 70 ? "Overbought" : "Neutral" },
    { label: "MACD",         value: macd  !== null ? macd.toFixed(2)  : "—", unit: "",  note: macd > 0 ? "Bullish"  : "Bearish" },
    { label: "Stoch %K",     value: stoch !== null ? stoch.toFixed(2) : "—", unit: "",  note: stoch < 25 ? "Oversold" : stoch > 75 ? "Overbought" : "Neutral" },
    { label: "MA 50",        value: fmt(ma50),  unit: "",  note: price > ma50  ? "Price above ↑" : "Price below ↓" },
    { label: "MA 200",       value: fmt(ma200), unit: "",  note: price > ma200 ? "Price above ↑" : "Price below ↓" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <Activity size={14} className="text-purple-400" />
          Technical Analysis
        </h3>
        <span className="text-xs text-gray-600">{asset.symbol}</span>
      </div>

      {/* Signal badge */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${signal.bg} ${signal.border}`}>
        <div className="flex items-center gap-2">
          <SignalIcon size={16} style={{ color: signal.color }} />
          <span className="text-sm font-bold" style={{ color: signal.color }}>
            {signal.label}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {signal.score} of 5 signals
        </span>
      </div>

      {/* RSI bar */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5">RSI (14)</p>
        <RSIBar value={rsi} />
      </div>

      {/* Indicator rows */}
      <div className="space-y-2">
        {rows.map(({ label, value, note }) => (
          <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
            <span className="text-xs text-gray-500">{label}</span>
            <div className="text-right">
              <span className="text-xs font-semibold text-white">{value}</span>
              {note && <span className="text-xs text-gray-600 ml-1.5">{note}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Support & Resistance */}
      {(sr.resistance.length > 0 || sr.support.length > 0) && (
        <div>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
            <BarChart2 size={11} /> Support & Resistance
          </p>
          <div className="space-y-1.5">
            {sr.resistance.map(r => (
              <div key={r} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-red-500/5 border border-red-500/20">
                <span className="text-xs text-red-400">Resistance</span>
                <span className="text-xs font-semibold text-red-300">${r.toLocaleString()}</span>
              </div>
            ))}
            {sr.support.map(s => (
              <div key={s} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-green-500/5 border border-green-500/20">
                <span className="text-xs text-green-400">Support</span>
                <span className="text-xs font-semibold text-green-300">${s.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TechnicalIndicators;
