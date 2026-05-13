export default function FearGreedMeter({ score = 50, label = "Neutral" }) {
  const clamped = Math.max(0, Math.min(100, Number(score || 0)));
  const angle = (clamped / 100) * 180 - 90;
  const color = clamped <= 30 ? "#ef4444" : clamped >= 70 ? "#22c55e" : "#f59e0b";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm font-semibold text-gray-300 mb-3">Fear &amp; Greed Meter</p>
      <div className="relative mx-auto h-32 w-64 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-64 rounded-full border-[20px] border-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-64 rounded-full border-[20px] border-transparent"
          style={{ borderTopColor: color, transform: `rotate(${angle}deg)`, transformOrigin: "50% 100%" }} />
        <div className="absolute left-1/2 bottom-0 h-20 w-1 -translate-x-1/2 rounded-full bg-white/80"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)`, transformOrigin: "50% 100%" }} />
      </div>
      <div className="text-center mt-2">
        <p className="text-2xl font-black text-white">{clamped}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
}

