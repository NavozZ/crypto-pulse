import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Section = ({ num, title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="py-16 border-t border-white/10"
  >
    <p className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2">{num}</p>
    <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{title}</h2>
    {children}
  </motion.section>
);

const Card = ({ color = "amber", title, children }) => {
  const colors = {
    amber:  "border-l-amber-400  bg-amber-400/5",
    green:  "border-l-green-400  bg-green-400/5",
    red:    "border-l-red-400    bg-red-400/5",
    purple: "border-l-purple-400 bg-purple-400/5",
    blue:   "border-l-blue-400   bg-blue-400/5",
  };
  return (
    <div className={`border-l-4 ${colors[color]} rounded-r-xl p-5`}>
      {title && <p className="font-bold text-white mb-2">{title}</p>}
      {children}
    </div>
  );
};

const FibLevel = ({ ratio, label, use, color }) => (
  <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
    <div className="w-16 text-right font-mono text-sm font-bold" style={{ color }}>{ratio}</div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-gray-500">{use}</p>
    </div>
    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
  </div>
);

export default function FibonacciGuide() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("retracement");

  return (
    <div className="min-h-screen bg-[#050010] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10 px-6 py-3 flex items-center gap-4">
        <button onClick={() => navigate("/learning")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
          <ArrowLeft size={16} /> Back to Learning
        </button>
        <div className="h-4 w-px bg-white/20" />
        <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Beginner</span>
        <span className="text-sm font-semibold">Fibonacci Retracement & Extension</span>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <div className="min-h-[60vh] flex flex-col justify-center py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-6">
            Beginner Level · Mathematical Harmony
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-6">
            FIBONACCI<br />
            <span className="text-amber-400">TRADING</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-gray-400 max-w-xl text-base leading-relaxed">
            The mathematical sequence found in nature that crypto markets respect with remarkable precision.
            Master retracements and extensions to identify high-probability entry and exit zones.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-2 mt-8">
            {["Golden Ratio 0.618", "0.382 Retracement", "1.618 Extension", "2.618 Target", "Price Zones"].map(t => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 border border-white/10 rounded text-gray-400">{t}</span>
            ))}
          </motion.div>
        </div>

        {/* Key Levels */}
        <Section num="01" title="Key Fibonacci Levels">
          <p className="text-gray-400 mb-8 max-w-xl">
            Derived from the Fibonacci sequence, these ratios act as invisible price magnets in crypto markets.
            The 0.618 "Golden Ratio" is the most powerful — it appears everywhere in nature and markets.
          </p>

          {/* Fibonacci SVG diagram */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">Bitcoin BTC — Fibonacci Retracement Example</p>
            <svg viewBox="0 0 800 320" className="w-full" style={{ fontFamily: "monospace" }}>
              {/* Background grid */}
              {[0,1,2,3,4,5,6,7].map(i => (
                <line key={i} x1={i*100+50} y1="20" x2={i*100+50} y2="300" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              ))}

              {/* Price line - swing up then retrace */}
              <polyline
                points="50,260 150,240 250,180 350,100 400,80 420,110 440,140 460,120 480,155 520,130 560,145 600,115 640,130"
                fill="none" stroke="#4ade80" strokeWidth="2" strokeLinejoin="round"
              />

              {/* Fib levels */}
              {[
                { y: 80,  pct: "0%",     label: "Swing High",  color: "#4ade80" },
                { y: 128, pct: "23.6%",  label: "23.6%",       color: "#a3e635" },
                { y: 160, pct: "38.2%",  label: "38.2%",       color: "#facc15" },
                { y: 187, pct: "50%",    label: "50%",         color: "#fb923c" },
                { y: 208, pct: "61.8%",  label: "61.8% ★",    color: "#f59e0b" },
                { y: 236, pct: "78.6%",  label: "78.6%",       color: "#f87171" },
                { y: 260, pct: "100%",   label: "Swing Low",   color: "#f87171" },
              ].map(({ y, pct, label, color }) => (
                <g key={pct}>
                  <line x1="50" y1={y} x2="700" y2={y} stroke={color} strokeWidth={label.includes("★") ? 1.5 : 0.8} strokeDasharray={label.includes("★") ? "none" : "4,4"} opacity="0.7" />
                  <text x="710" y={y + 4} fill={color} fontSize="11" opacity="0.9">{pct}</text>
                  <text x="14" y={y + 4} fill={color} fontSize="10" opacity="0.7">{label.replace(" ★","")}</text>
                </g>
              ))}

              {/* Retracement arrow */}
              <line x1="400" y1="80" x2="400" y2="208" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" />
                </marker>
              </defs>
              <text x="408" y="148" fill="#f59e0b" fontSize="10">Retrace to 0.618</text>

              {/* Buy zone box */}
              <rect x="50" y="198" width="350" height="28" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" rx="3" />
              <text x="60" y="216" fill="#f59e0b" fontSize="11" fontWeight="600">BUY ZONE — 0.618 Golden Ratio Support</text>
            </svg>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            {[
              { ratio: "0.236", label: "23.6% — Shallow retracement", use: "Strong trend continuation — weak support", color: "#a3e635" },
              { ratio: "0.382", label: "38.2% — Common pullback zone", use: "First significant support in strong trends", color: "#facc15" },
              { ratio: "0.500", label: "50% — Mid-point (Dow theory)", use: "Psychological level — not true Fibonacci", color: "#fb923c" },
              { ratio: "0.618", label: "61.8% — The Golden Ratio ★", use: "Strongest support/resistance — highest probability", color: "#f59e0b" },
              { ratio: "0.786", label: "78.6% — Deep retracement", use: "Last defence before trend reversal", color: "#f87171" },
            ].map(level => <FibLevel key={level.ratio} {...level} />)}
          </div>
        </Section>

        {/* Retracement vs Extension */}
        <Section num="02" title="Retracement vs Extension">
          <p className="text-gray-400 mb-8 max-w-xl">Two tools, two purposes. Retracements find where price pulls back to. Extensions project where price goes after a breakout.</p>

          <div className="flex gap-2 mb-6">
            {["retracement", "extension"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  activeTab === tab ? "bg-amber-500/20 border border-amber-500/50 text-amber-400" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "retracement" ? (
            <div className="space-y-4">
              <Card color="amber" title="📉 Fibonacci Retracement — Entry Tool">
                <p className="text-gray-400 text-sm">Draw from swing LOW to swing HIGH (uptrend). Price pulls back to a Fibonacci level — that's your entry zone.</p>
              </Card>
              <Card color="green" title="✅ Setup:">
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>1. Identify a clear swing high and swing low</li>
                  <li>2. Draw Fibonacci tool from low → high</li>
                  <li>3. Wait for price to retrace to 0.382 / 0.618</li>
                  <li>4. Look for bullish candle confirmation at that level</li>
                  <li>5. Enter long — stop loss below the swing low</li>
                </ul>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <Card color="purple" title="📈 Fibonacci Extension — Profit Target Tool">
                <p className="text-gray-400 text-sm">After a retracement bounce, extensions project where the next impulse will travel. Use 1.618 and 2.618 as take-profit zones.</p>
              </Card>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                {[
                  { ratio: "1.272", use: "First extension target", color: "#a78bfa" },
                  { ratio: "1.618", use: "Golden extension — main take profit ★", color: "#f59e0b" },
                  { ratio: "2.000", use: "Psychological level", color: "#fb923c" },
                  { ratio: "2.618", use: "Final extension — strong reversal zone", color: "#f87171" },
                ].map(l => <FibLevel key={l.ratio} {...l} label={l.ratio} />)}
              </div>
            </div>
          )}
        </Section>

        {/* Crypto Application */}
        <Section num="03" title="Applying to Crypto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card color="green" title="✅ Works best when:">
              <ul className="text-sm text-gray-400 space-y-1.5 mt-1">
                <li>• Clear trending market (not sideways)</li>
                <li>• High volume at the swing points</li>
                <li>• Multiple timeframe confluence</li>
                <li>• Combined with RSI or MACD confirmation</li>
                <li>• BTC or ETH (more institutional participation)</li>
              </ul>
            </Card>
            <Card color="red" title="❌ Avoid when:">
              <ul className="text-sm text-gray-400 space-y-1.5 mt-1">
                <li>• Choppy / ranging market</li>
                <li>• During major news events</li>
                <li>• Very small cap altcoins (low liquidity)</li>
                <li>• Using alone without confirmation</li>
                <li>• Forcing levels that don't fit the chart</li>
              </ul>
            </Card>
          </div>
          <Card color="amber" title="💡 Pro Tip — Confluence Zones">
            <p className="text-sm text-gray-400 mt-1">The most powerful setups occur when a Fibonacci level aligns with another key level — such as a previous support/resistance zone, a moving average (MA50/MA200), or a round psychological number like $50,000. Three confluences = very high probability trade.</p>
          </Card>
        </Section>

        <div className="py-12 text-center">
          <p className="text-xs text-gray-700 font-mono">CryptoPulse Learning · Fibonacci Retracement & Extension · Beginner Level</p>
        </div>
      </div>
    </div>
  );
}
