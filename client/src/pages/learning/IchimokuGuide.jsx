import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Section = ({ num, title, children }) => (
  <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
    className="py-16 border-t border-white/10">
    <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-2">{num}</p>
    <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{title}</h2>
    {children}
  </motion.section>
);

const Card = ({ color = "blue", title, children }) => {
  const map = { blue: "border-l-blue-400 bg-blue-400/5", green: "border-l-green-400 bg-green-400/5", red: "border-l-red-400 bg-red-400/5", yellow: "border-l-yellow-400 bg-yellow-400/5", purple: "border-l-purple-400 bg-purple-400/5" };
  return (
    <div className={`border-l-4 ${map[color]} rounded-r-xl p-5`}>
      {title && <p className="font-bold text-white mb-2">{title}</p>}
      {children}
    </div>
  );
};

const components = [
  { name: "Tenkan-sen", period: "9", aka: "Conversion Line", role: "Short-term momentum. Direction shows current trend", color: "#3b82f6" },
  { name: "Kijun-sen",  period: "26", aka: "Base Line",       role: "Medium-term trend. Key support/resistance", color: "#f59e0b" },
  { name: "Senkou A",   period: "26 ahead", aka: "Leading Span A", role: "Fast cloud boundary — stronger when rising", color: "#4ade80" },
  { name: "Senkou B",   period: "52 ahead", aka: "Leading Span B", role: "Slow cloud boundary — major S/R zone", color: "#f87171" },
  { name: "Chikou",     period: "26 back",  aka: "Lagging Span",   role: "Current close shifted back — confirms signal", color: "#a855f7" },
];

export default function IchimokuGuide() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  return (
    <div className="min-h-screen bg-[#050010] text-white">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10 px-6 py-3 flex items-center gap-4">
        <button onClick={() => navigate("/learning")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
          <ArrowLeft size={16} /> Back to Learning
        </button>
        <div className="h-4 w-px bg-white/20" />
        <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Intermediate</span>
        <span className="text-sm font-semibold">Ichimoku Cloud</span>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <div className="min-h-[60vh] flex flex-col justify-center py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-6">
            Intermediate Level · All-in-One Indicator
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
            ICHIMOKU<br /><span className="text-blue-400">CLOUD</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-gray-400 max-w-xl text-base leading-relaxed">
            The "one glance equilibrium chart" from Japan. Ichimoku is a complete trading system in a single indicator —
            showing trend, momentum, support, resistance, and signal generation simultaneously.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-2 mt-8">
            {["Kumo Cloud", "TK Cross", "Chikou Span", "Bullish/Bearish Cloud", "Kumo Breakout"].map(t => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 border border-white/10 rounded text-gray-400">{t}</span>
            ))}
          </motion.div>
        </div>

        {/* 5 Components */}
        <Section num="01" title="The 5 Components">
          <p className="text-gray-400 mb-8 max-w-xl">Ichimoku consists of 5 lines. Each tells a different story — together they give a complete picture of the market in a single glance. Click each component to learn more.</p>

          {/* Ichimoku SVG diagram */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">Ichimoku Cloud — Full Component View</p>
            <svg viewBox="0 0 800 300" className="w-full" style={{ fontFamily: "monospace" }}>
              {/* Cloud area (Kumo) */}
              <polygon points="200,180 300,160 400,140 500,120 600,130 700,120 700,160 600,170 500,165 400,180 300,200 200,220"
                fill="rgba(74,222,128,0.08)" stroke="none" />
              {/* Cloud borders */}
              <polyline points="200,180 300,160 400,140 500,120 600,130 700,120" fill="none" stroke="#4ade80" strokeWidth="1.5" opacity="0.6" />
              <polyline points="200,220 300,200 400,180 500,165 600,170 700,160" fill="none" stroke="#f87171" strokeWidth="1.5" opacity="0.6" />

              {/* Price candles (simplified) */}
              {[[80,140,160,130,150],[120,130,150,125,135],[160,125,145,118,140],[200,115,140,112,135],[240,108,132,105,128]].map(([x,o,h,l,c],i) => (
                <g key={i}>
                  <line x1={x} y1={l} x2={x} y2={h} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                  <rect x={x-5} y={Math.min(o,c)} width="10" height={Math.abs(o-c)+1} fill={c >= o ? "#4ade80" : "#f87171"} />
                </g>
              ))}

              {/* Tenkan-sen - blue */}
              <polyline points="50,165 150,155 250,140 350,125 450,110 550,115 650,108 750,112"
                fill="none" stroke="#3b82f6" strokeWidth="2" />
              {/* Kijun-sen - yellow */}
              <polyline points="50,180 150,175 250,165 350,148 450,138 550,135 650,128 750,132"
                fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3" />
              {/* Chikou - purple (shifted back) */}
              <polyline points="50,140 150,135 250,125 350,118 450,108 550,115"
                fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.7" />

              {/* Labels */}
              <text x="755" y="116" fill="#3b82f6" fontSize="10">Tenkan</text>
              <text x="755" y="136" fill="#f59e0b" fontSize="10">Kijun</text>
              <text x="555" y="112" fill="#a855f7" fontSize="10">Chikou</text>
              <text x="420" y="152" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="600">KUMO CLOUD</text>
              <text x="420" y="130" fill="#4ade80" fontSize="9">Senkou A</text>
              <text x="420" y="175" fill="#f87171" fontSize="9">Senkou B</text>

              {/* TK Cross marker */}
              <circle cx="450" cy="110" r="8" fill="none" stroke="#4ade80" strokeWidth="1.5" />
              <text x="462" y="106" fill="#4ade80" fontSize="10" fontWeight="600">TK Cross</text>

              {/* Kumo breakout arrow */}
              <line x1="240" y1="122" x2="240" y2="148" stroke="#facc15" strokeWidth="1.5" markerEnd="url(#arrowY)" />
              <defs>
                <marker id="arrowY" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#facc15" />
                </marker>
              </defs>
              <text x="246" y="138" fill="#facc15" fontSize="9">Kumo Breakout</text>
            </svg>
          </div>

          <div className="space-y-3">
            {components.map(comp => (
              <motion.div key={comp.name} whileHover={{ x: 4 }}
                onClick={() => setActive(active === comp.name ? null : comp.name)}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-4 cursor-pointer hover:border-white/20 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }} />
                    <div>
                      <span className="font-bold text-sm">{comp.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({comp.period} periods)</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono" style={{ color: comp.color }}>{comp.aka}</span>
                </div>
                {active === comp.name && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-gray-400 mt-3 pt-3 border-t border-white/10">
                    {comp.role}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Trading Signals */}
        <Section num="02" title="Ichimoku Trading Signals">
          <p className="text-gray-400 mb-8 max-w-xl">Three primary signals — each more powerful than the last. Use them together for maximum confluence.</p>

          <div className="space-y-4 mb-6">
            <Card color="green" title="Signal 1 — TK Cross (Tenkan/Kijun Crossover)">
              <p className="text-sm text-gray-400 mt-1">Bullish: Tenkan crosses above Kijun. Bearish: Tenkan crosses below Kijun. Works best when price is above the cloud (bullish cross) or below the cloud (bearish cross).</p>
            </Card>
            <Card color="blue" title="Signal 2 — Kumo Breakout">
              <p className="text-sm text-gray-400 mt-1">Price breaking above a green cloud = strong bullish signal. Price breaking below a red cloud = strong bearish signal. The thicker the cloud, the stronger the resistance/support broken.</p>
            </Card>
            <Card color="purple" title="Signal 3 — Chikou Confirmation">
              <p className="text-sm text-gray-400 mt-1">The Chikou span (current close shifted 26 bars back) must be above price 26 bars ago to confirm bullish trades. This confirms that momentum supports the current move.</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card color="green" title="✅ Strong Bullish Setup:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Price above the cloud</li>
                <li>• Cloud is green (Senkou A above Senkou B)</li>
                <li>• Bullish TK cross above the cloud</li>
                <li>• Chikou above price 26 bars ago</li>
              </ul>
            </Card>
            <Card color="red" title="🔴 Strong Bearish Setup:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Price below the cloud</li>
                <li>• Cloud is red (Senkou B above Senkou A)</li>
                <li>• Bearish TK cross below the cloud</li>
                <li>• Chikou below price 26 bars ago</li>
              </ul>
            </Card>
          </div>
        </Section>

        {/* Crypto Application */}
        <Section num="03" title="Ichimoku in Crypto Markets">
          <Card color="yellow" title="⚡ Crypto-Specific Adjustment">
            <p className="text-sm text-gray-400 mt-1">Traditional Ichimoku uses (9, 26, 52) settings for stock markets. Many crypto traders use (10, 30, 60) or (20, 60, 120) to better account for 24/7 trading and higher volatility. Test both on your preferred timeframe.</p>
          </Card>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <Card color="green" title="✅ Best Timeframes:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• 4H chart — swing trading</li>
                <li>• Daily chart — position trading</li>
                <li>• Weekly — macro trend direction</li>
              </ul>
            </Card>
            <Card color="blue" title="💡 Pro Usage:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Use weekly cloud for overall trend</li>
                <li>• Enter on 4H TK cross with daily above cloud</li>
                <li>• Cloud thickness = strength of S/R</li>
              </ul>
            </Card>
          </div>
        </Section>

        <div className="py-12 text-center">
          <p className="text-xs text-gray-700 font-mono">CryptoPulse Learning · Ichimoku Cloud · Intermediate Level</p>
        </div>
      </div>
    </div>
  );
}
