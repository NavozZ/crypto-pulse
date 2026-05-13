import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export default function AIExplanationCard({ prediction, confidence, reasoning, status = "pending" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-purple-300">AI Explanation</p>
          <h3 className="text-lg font-bold text-white mt-1">
            {prediction === "bullish" ? "Bullish" : prediction === "bearish" ? "Bearish" : "Neutral"} outlook
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-purple-500/20 border border-purple-500/40 px-2 py-1 text-xs font-semibold text-purple-200">
            Confidence {Math.round(Number(confidence || 0))}%
          </span>
          <StatusBadge status={status} />
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-300 flex items-start gap-2">
        <Sparkles size={14} className="mt-0.5 text-purple-300 shrink-0" />
        {reasoning?.summary || "No explanation available."}
      </p>

      <button
        onClick={() => setOpen((value) => !value)}
        className="mt-3 inline-flex items-center gap-1 text-xs text-purple-300 hover:text-white transition"
      >
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {open ? "Hide details" : "Show detailed signals"}
      </button>

      {open && (
        <div className="mt-3 grid gap-2 md:grid-cols-2 text-xs text-gray-300">
          <p className="rounded-lg bg-white/5 p-2"><strong>RSI:</strong> {reasoning?.rsi_condition || "N/A"}</p>
          <p className="rounded-lg bg-white/5 p-2"><strong>MACD:</strong> {reasoning?.macd_signal || "N/A"}</p>
          <p className="rounded-lg bg-white/5 p-2"><strong>Sentiment:</strong> {reasoning?.sentiment_influence || "N/A"}</p>
          <p className="rounded-lg bg-white/5 p-2"><strong>Trend:</strong> {reasoning?.trend_reasoning || "N/A"}</p>
          <p className="rounded-lg bg-white/5 p-2 md:col-span-2"><strong>Volatility:</strong> {reasoning?.volatility_analysis || "N/A"}</p>
        </div>
      )}
    </div>
  );
}

