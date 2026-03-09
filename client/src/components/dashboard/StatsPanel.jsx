import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, BarChart2, Activity } from "lucide-react";

// Format large numbers: 1,234,567,890 → $1.23B
const formatLarge = (num) => {
  if (!num) return "—";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9)  return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6)  return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

const StatCard = ({ icon: Icon, label, value, subValue, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-4 overflow-hidden group hover:border-white/20 transition"
  >
    {/* Background glow */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      style={{ background: `radial-gradient(circle at 0% 0%, ${accent}15, transparent 60%)` }}
    />

    <div className="relative flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-lg font-bold text-white truncate">{value}</p>
        {subValue && (
          <p className="text-xs text-gray-500 mt-1">{subValue}</p>
        )}
      </div>

      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: accent + "22" }}
      >
        <Icon size={16} style={{ color: accent }} />
      </div>
    </div>
  </motion.div>
);

const StatsPanel = ({ stats, asset }) => {
  const isPositive = stats.change24h >= 0;

  const cards = [
    {
      icon: DollarSign,
      label: "Current Price",
      value: `$${stats.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subValue: `${asset.symbol}/USD`,
      accent: asset.color,
    },
    {
      icon: isPositive ? TrendingUp : TrendingDown,
      label: "24h Change",
      value: `${isPositive ? "+" : ""}${stats.change24h.toFixed(2)}%`,
      subValue: isPositive ? "Bullish momentum" : "Bearish pressure",
      accent: isPositive ? "#4ade80" : "#f87171",
    },
    {
      icon: BarChart2,
      label: "Market Cap",
      value: formatLarge(stats.marketCap),
      subValue: "Total valuation",
      accent: "#60a5fa",
    },
    {
      icon: Activity,
      label: "24h Volume",
      value: formatLarge(stats.volume24h),
      subValue: "Trading activity",
      accent: "#f59e0b",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <StatCard key={card.label} {...card} delay={i * 0.08} />
      ))}
    </div>
  );
};

export default StatsPanel;
