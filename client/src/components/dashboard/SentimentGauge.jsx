import { motion } from "framer-motion";
import { MessageSquare, RefreshCw } from "lucide-react";

const SentimentArc = ({ score = 0 }) => {
  const cx = 80, cy = 80, r = 60;
  const needleRad = Math.PI - ((score + 1) / 2) * Math.PI;
  const needleX   = cx + r * 0.72 * Math.cos(needleRad);
  const needleY   = cy - r * 0.72 * Math.sin(needleRad);

  const arcColor =
    score >= 0.3  ? "#4ade80" :
    score <= -0.3 ? "#f87171" : "#facc15";

  const arcEnd   = needleRad;
  const largeArc = needleRad < Math.PI / 2 ? 0 : 1;

  const startX = cx + r * Math.cos(Math.PI);
  const startY = cy - r * Math.sin(Math.PI);
  const endX   = cx + r * Math.cos(arcEnd);
  const endY   = cy - r * Math.sin(arcEnd);

  const trackEndX = cx + r * Math.cos(0);
  const trackEndY = cy - r * Math.sin(0);

  return (
    <svg viewBox="0 0 160 100" className="w-full">
      <defs>
        <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#f87171" stopOpacity="0.4" />
          <stop offset="50%"  stopColor="#facc15" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* Track */}
      <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${trackEndX} ${trackEndY}`}
        fill="none" stroke="url(#trackGrad)" strokeWidth="8" strokeLinecap="round" />
      {/* Filled arc */}
      <motion.path key={score}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
        fill="none" stroke={arcColor} strokeWidth="8" strokeLinecap="round" opacity="0.85" />
      {/* Ticks */}
      {[-1, -0.5, 0, 0.5, 1].map(tick => {
        const a = Math.PI - ((tick + 1) / 2) * Math.PI;
        const inner = r - 10;
        return <line key={tick}
          x1={cx + inner * Math.cos(a)} y1={cy - inner * Math.sin(a)}
          x2={cx + r     * Math.cos(a)} y2={cy - r     * Math.sin(a)}
          stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />;
      })}
      {/* Needle */}
      <motion.line key={`needle-${score}`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        x1={cx} y1={cy} x2={needleX} y2={needleY}
        stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="white" opacity="0.9" />
      {/* Score */}
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="11"
        fill="rgba(255,255,255,0.7)" fontFamily="monospace">
        {score >= 0 ? "+" : ""}{score.toFixed(2)}
      </text>
      <text x="8"  y="90" fontSize="8" fill="#f87171" opacity="0.7">Bear</text>
      <text x="70" y="25" fontSize="8" fill="#facc15" opacity="0.7" textAnchor="middle">Neutral</text>
      <text x="140" y="90" fontSize="8" fill="#4ade80" opacity="0.7" textAnchor="end">Bull</text>
    </svg>
  );
};

const getSentimentColor = (label) => {
  const map = {
    "Very Bullish": "#4ade80",
    "Bullish":      "#86efac",
    "Neutral":      "#facc15",
    "Bearish":      "#fca5a5",
    "Very Bearish": "#f87171",
  };
  return map[label] || "#facc15";
};

// ── Component ──────────────────────────────────────────────────────────────
// Props:
//   score     — VADER compound score (-1.0 to +1.0) from /api/sentiment/:coinId
//   label     — "Bullish" | "Bearish" | etc from Python
//   postCount — number of posts analysed
//   sources   — ["Reddit", "X (Twitter)"]
//   loading   — true while fetching
const SentimentGauge = ({ asset, score = 0, label, postCount, sources, loading }) => {
  const displayLabel = label || "Neutral";
  const color        = getSentimentColor(displayLabel);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-4">

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <MessageSquare size={14} className="text-purple-400" />
          Market Sentiment
        </h3>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          {loading && <RefreshCw size={10} className="animate-spin" />}
          VADER
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-28 gap-2">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500">Analysing posts…</p>
        </div>
      ) : (
        <>
          <div className="px-2">
            <SentimentArc score={score} />
          </div>
          <div className="text-center mt-1">
            <span className="text-sm font-bold" style={{ color }}>{displayLabel}</span>
            <p className="text-xs text-gray-500 mt-1">{asset.symbol} social media mood</p>
          </div>

          {postCount !== undefined && (
            <p className="text-center text-xs text-gray-600 mt-1">
              {postCount} posts analysed
            </p>
          )}

          <div className="flex gap-2 mt-3 justify-center flex-wrap">
            {(sources && sources.length > 0 ? sources : ["Reddit", "X (Twitter)"]).map(src => (
              <span key={src}
                className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-500">
                {src}
              </span>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SentimentGauge;
