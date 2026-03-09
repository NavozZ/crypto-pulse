import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

// ─── SVG Semi-Circular Gauge ──────────────────────────────────────────────
// score: -1.0 (very negative) to +1.0 (very positive)
// 0.0 = Neutral (needle points straight up)
const SentimentArc = ({ score = 0 }) => {
  const cx = 80, cy = 80, r = 60;

  // Arc from 180° to 0° (semi-circle, left to right)
  const startAngle = Math.PI;        // 180° = leftmost (very negative)
  const endAngle   = 0;              // 0°   = rightmost (very positive)

  // Needle angle: map score [-1, 1] → [180°, 0°]
  const needleRad = Math.PI - ((score + 1) / 2) * Math.PI;
  const needleX   = cx + r * 0.72 * Math.cos(needleRad);
  const needleY   = cy - r * 0.72 * Math.sin(needleRad);  // SVG y is inverted

  // Colour of the filled arc matches sentiment
  const arcColor =
    score >= 0.3  ? "#4ade80" :
    score <= -0.3 ? "#f87171" :
    "#facc15";

  // Filled arc: from startAngle to current needle angle
  const arcEnd    = needleRad;
  const largeArc  = needleRad < (Math.PI / 2) ? 0 : 1;

  const arcStartX = cx + r * Math.cos(startAngle);
  const arcStartY = cy - r * Math.sin(startAngle);
  const arcEndX   = cx + r * Math.cos(arcEnd);
  const arcEndY   = cy - r * Math.sin(arcEnd);

  // Track arc (full semi-circle background)
  const trackStartX = cx + r * Math.cos(Math.PI);
  const trackStartY = cy - r * Math.sin(Math.PI);
  const trackEndX   = cx + r * Math.cos(0);
  const trackEndY   = cy - r * Math.sin(0);

  return (
    <svg viewBox="0 0 160 100" className="w-full">
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#f87171" stopOpacity="0.4" />
          <stop offset="50%"  stopColor="#facc15" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Track arc */}
      <path
        d={`M ${trackStartX} ${trackStartY} A ${r} ${r} 0 0 1 ${trackEndX} ${trackEndY}`}
        fill="none"
        stroke="url(#trackGrad)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Filled arc */}
      <motion.path
        key={score}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        d={`M ${arcStartX} ${arcStartY} A ${r} ${r} 0 ${largeArc} 1 ${arcEndX} ${arcEndY}`}
        fill="none"
        stroke={arcColor}
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Tick marks */}
      {[-1, -0.5, 0, 0.5, 1].map((tick) => {
        const angle = Math.PI - ((tick + 1) / 2) * Math.PI;
        const inner = r - 10;
        const x1 = cx + inner * Math.cos(angle);
        const y1 = cy - inner * Math.sin(angle);
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy - r * Math.sin(angle);
        return (
          <line
            key={tick}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        );
      })}

      {/* Needle */}
      <motion.line
        key={`needle-${score}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        x1={cx} y1={cy}
        x2={needleX} y2={needleY}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="4" fill="white" opacity="0.9" />

      {/* Centre score text */}
      <text
        x={cx} y={cy + 18}
        textAnchor="middle"
        fontSize="11"
        fill="rgba(255,255,255,0.7)"
        fontFamily="monospace"
      >
        {score >= 0 ? "+" : ""}{score.toFixed(2)}
      </text>

      {/* Labels */}
      <text x="8"  y="90" fontSize="8" fill="#f87171" opacity="0.7">Bear</text>
      <text x="70" y="25" fontSize="8" fill="#facc15" opacity="0.7" textAnchor="middle">Neutral</text>
      <text x="140" y="90" fontSize="8" fill="#4ade80" opacity="0.7" textAnchor="end">Bull</text>
    </svg>
  );
};

// ─── Labels ──────────────────────────────────────────────────────────────
const getSentimentLabel = (score) => {
  if (score >=  0.5) return { label: "Very Bullish",  color: "#4ade80" };
  if (score >=  0.1) return { label: "Bullish",        color: "#86efac" };
  if (score >  -0.1) return { label: "Neutral",        color: "#facc15" };
  if (score >= -0.5) return { label: "Bearish",        color: "#fca5a5" };
  return               { label: "Very Bearish",  color: "#f87171" };
};

// ─── Component ────────────────────────────────────────────────────────────
// score prop: feed the VADER compound score here when Python integration is ready
const SentimentGauge = ({ asset, score = 0.0 }) => {
  const { label, color } = getSentimentLabel(score);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <MessageSquare size={14} className="text-purple-400" />
          Market Sentiment
        </h3>
        <span className="text-xs text-gray-500">VADER</span>
      </div>

      {/* Gauge */}
      <div className="px-2">
        <SentimentArc score={score} />
      </div>

      {/* Label */}
      <div className="text-center mt-1">
        <span
          className="text-sm font-bold"
          style={{ color }}
        >
          {label}
        </span>
        <p className="text-xs text-gray-500 mt-1">
          {asset.symbol} social media mood
        </p>
      </div>

      {/* Source tags */}
      <div className="flex gap-2 mt-3 justify-center">
        {["X (Twitter)", "Reddit"].map((src) => (
          <span
            key={src}
            className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-500"
          >
            {src}
          </span>
        ))}
      </div>

      {/* Integration note */}
      <p className="text-xs text-center text-purple-400/50 mt-3">
        Live VADER scoring — integration in progress
      </p>
    </motion.div>
  );
};

export default SentimentGauge;
