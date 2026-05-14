import GlassCard from "../common/GlassCard";

export default function AccuracyTrendChart({ points = [] }) {
  const width = 900;
  const height = 260;
  const padding = 34;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  if (!points.length) {
    return (
      <GlassCard className="p-5">
        <p className="text-sm text-gray-400">No trend data available yet.</p>
      </GlassCard>
    );
  }

  const values = points.map((item) => Number(item.accuracy || 0));
  const maxValue = Math.max(...values, 100);
  const minValue = Math.min(...values, 0);
  const range = Math.max(1, maxValue - minValue);

  const mapped = points.map((point, index) => {
    const x = padding + (index / Math.max(1, points.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((Number(point.accuracy || 0) - minValue) / range) * chartHeight;
    return { x, y, raw: point };
  });

  return (
    <GlassCard className="p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Accuracy Trend</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[240px]">
        {[0, 1, 2, 3, 4].map((step) => (
          <line
            key={step}
            x1={padding}
            x2={width - padding}
            y1={padding + (step * chartHeight) / 4}
            y2={padding + (step * chartHeight) / 4}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4"
          />
        ))}
        <polyline
          points={mapped.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {mapped.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="4" fill="#c084fc" />
        ))}
      </svg>
    </GlassCard>
  );
}

