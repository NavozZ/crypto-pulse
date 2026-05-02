import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Section = ({ num, title, children }) => (
  <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
    className="py-16 border-t border-white/10">
    <p className="text-xs font-mono tracking-widest text-green-400 uppercase mb-2">{num}</p>
    <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{title}</h2>
    {children}
  </motion.section>
);

const Card = ({ color = "green", title, children }) => {
  const map = { green: "border-l-green-400 bg-green-400/5", red: "border-l-red-400 bg-red-400/5", yellow: "border-l-yellow-400 bg-yellow-400/5", blue: "border-l-blue-400 bg-blue-400/5", purple: "border-l-purple-400 bg-purple-400/5" };
  return (
    <div className={`border-l-4 ${map[color]} rounded-r-xl p-5`}>
      {title && <p className="font-bold text-white mb-2">{title}</p>}
      {children}
    </div>
  );
};

export default function RSIMACDGuide() {
  const navigate = useNavigate();
  const [rsiValue, setRsiValue] = useState(45);

  const getRSIColor = (v) => v > 70 ? "#f87171" : v < 30 ? "#4ade80" : "#a855f7";
  const getRSILabel = (v) => v > 70 ? "Overbought — Consider Selling" : v < 30 ? "Oversold — Consider Buying" : "Neutral Zone";

  return (
    <div className="min-h-screen bg-[#050010] text-white">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10 px-6 py-3 flex items-center gap-4">
        <button onClick={() => navigate("/learning")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
          <ArrowLeft size={16} /> Back to Learning
        </button>
        <div className="h-4 w-px bg-white/20" />
        <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Beginner</span>
        <span className="text-sm font-semibold">RSI + MACD Combo</span>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <div className="min-h-[60vh] flex flex-col justify-center py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xs font-mono tracking-widest text-green-400 uppercase mb-6">
            Beginner Level · Momentum Analysis
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-6">
            RSI +<br /><span className="text-green-400">MACD</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-gray-400 max-w-xl text-base leading-relaxed">
            The two most widely used momentum indicators in crypto. Together they identify overbought/oversold conditions
            and momentum shifts — giving you high-confidence entry and exit signals.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-2 mt-8">
            {["RSI Divergence", "MACD Crossover", "Zero Line", "Histogram", "Overbought/Oversold"].map(t => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 border border-white/10 rounded text-gray-400">{t}</span>
            ))}
          </motion.div>
        </div>

        {/* RSI Section */}
        <Section num="01" title="RSI — Relative Strength Index">
          <p className="text-gray-400 mb-8 max-w-xl">RSI measures speed and magnitude of price movements on a 0-100 scale. Above 70 = overbought. Below 30 = oversold. The 14-period RSI is the standard for crypto.</p>

          {/* Interactive RSI simulator */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">Interactive RSI Simulator</p>
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-red-400">Oversold (30)</span>
                <span style={{ color: getRSIColor(rsiValue) }} className="font-bold text-base">RSI: {rsiValue}</span>
                <span className="text-green-400">Overbought (70)</span>
              </div>
              <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-2">
                <div className="absolute left-0 top-0 h-full w-[30%] bg-green-500/20 rounded-l-full" />
                <div className="absolute right-0 top-0 h-full w-[30%] bg-red-500/20 rounded-r-full" />
                <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-px h-full bg-green-400/40" />
                <div className="absolute top-1/2 left-[70%] -translate-y-1/2 w-px h-full bg-red-400/40" />
                <motion.div animate={{ width: `${rsiValue}%` }} transition={{ type: "spring", stiffness: 300 }}
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ backgroundColor: getRSIColor(rsiValue) }} />
              </div>
              <input type="range" min="0" max="100" value={rsiValue} onChange={e => setRsiValue(Number(e.target.value))}
                className="w-full accent-purple-500" />
              <p className="text-center mt-3 font-semibold" style={{ color: getRSIColor(rsiValue) }}>
                {getRSILabel(rsiValue)}
              </p>
            </div>
          </div>

          {/* RSI Chart SVG */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">RSI Overbought + Divergence Example</p>
            <svg viewBox="0 0 800 200" className="w-full" style={{ fontFamily: "monospace" }}>
              {/* Grid */}
              <line x1="50" y1="40" x2="780" y2="40" stroke="rgba(248,113,113,0.3)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="50" y1="100" x2="780" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="50" y1="160" x2="780" y2="160" stroke="rgba(74,222,128,0.3)" strokeWidth="1" strokeDasharray="4,4" />
              <text x="10" y="44" fill="rgba(248,113,113,0.7)" fontSize="10">70</text>
              <text x="10" y="104" fill="rgba(255,255,255,0.4)" fontSize="10">50</text>
              <text x="10" y="164" fill="rgba(74,222,128,0.7)" fontSize="10">30</text>

              {/* RSI line */}
              <polyline points="50,120 100,100 160,60 200,35 250,45 310,80 380,100 440,75 500,40 560,38 620,90 680,140 740,120 780,130"
                fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinejoin="round" />

              {/* Overbought zone fill */}
              <polygon points="160,60 200,35 250,45 160,40" fill="rgba(248,113,113,0.1)" />
              <text x="165" y="30" fill="#f87171" fontSize="10" fontWeight="600">Overbought → Sell Signal</text>

              {/* Oversold zone */}
              <polygon points="620,90 680,140 740,120 780,130 780,160 620,160" fill="rgba(74,222,128,0.1)" />
              <text x="625" y="155" fill="#4ade80" fontSize="10" fontWeight="600">Oversold → Buy Signal</text>
            </svg>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { range: "RSI > 70", label: "Overbought", action: "Look to sell or take profit", color: "red" },
              { range: "RSI 30-70", label: "Neutral", action: "Wait for breakout or use other signals", color: "purple" },
              { range: "RSI < 30", label: "Oversold", action: "Look to buy or average down", color: "green" },
            ].map(({ range, label, action, color }) => (
              <Card key={range} color={color} title={range}>
                <p className="text-xs font-semibold text-gray-300 mb-1">{label}</p>
                <p className="text-xs text-gray-500">{action}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* MACD Section */}
        <Section num="02" title="MACD — Moving Average Convergence Divergence">
          <p className="text-gray-400 mb-8 max-w-xl">MACD tracks the relationship between two EMAs (12 and 26 periods) to identify trend direction and momentum shifts. The signal line crossover is the key entry/exit trigger.</p>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">MACD Components Explained</p>
            <svg viewBox="0 0 800 220" className="w-full" style={{ fontFamily: "monospace" }}>
              {/* Zero line */}
              <line x1="50" y1="110" x2="780" y2="110" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <text x="10" y="114" fill="rgba(255,255,255,0.3)" fontSize="10">0</text>

              {/* MACD line */}
              <polyline points="50,120 120,115 200,95 280,70 350,60 400,80 450,100 500,85 560,65 620,90 680,130 740,140 780,150"
                fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />

              {/* Signal line */}
              <polyline points="50,125 120,120 200,105 280,82 350,68 400,75 450,95 500,88 560,70 620,88 680,120 740,145 780,152"
                fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" strokeDasharray="5,3" />

              {/* Histogram bars */}
              {[[120,0],[200,-10],[280,-25],[350,-40],[400,-20],[450,5],[500,-3],[560,-20],[620,2],[680,20],[740,10]].map(([x,h],i) => (
                <rect key={i} x={x-8} y={h < 0 ? 110+h : 110} width="16" height={Math.abs(h)} fill={h < 0 ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"} />
              ))}

              {/* Labels */}
              <text x="60" y="90" fill="#3b82f6" fontSize="11">MACD Line (12,26 EMA diff)</text>
              <text x="60" y="175" fill="#f59e0b" fontSize="11">Signal Line (9 EMA of MACD)</text>
              <text x="400" y="30" fill="rgba(255,255,255,0.4)" fontSize="10">Histogram = MACD − Signal</text>

              {/* Crossover arrows */}
              <text x="330" y="45" fill="#4ade80" fontSize="10" fontWeight="600">↑ Bullish Cross</text>
              <text x="610" y="75" fill="#f87171" fontSize="10" fontWeight="600">↓ Bearish Cross</text>
            </svg>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card color="green" title="🟢 Bullish MACD Signal">
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• MACD line crosses above Signal line</li>
                <li>• Histogram turns green (positive)</li>
                <li>• MACD crosses above zero line</li>
                <li>• Bullish divergence (price down, MACD up)</li>
              </ul>
            </Card>
            <Card color="red" title="🔴 Bearish MACD Signal">
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• MACD line crosses below Signal line</li>
                <li>• Histogram turns red (negative)</li>
                <li>• MACD crosses below zero line</li>
                <li>• Bearish divergence (price up, MACD down)</li>
              </ul>
            </Card>
          </div>
        </Section>

        {/* Combined Strategy */}
        <Section num="03" title="RSI + MACD Combined Strategy">
          <p className="text-gray-400 mb-8 max-w-xl">The real power is using both together. When RSI and MACD agree — the probability of a successful trade rises significantly.</p>

          <div className="space-y-4 mb-8">
            <Card color="green" title="🎯 High Probability BUY Setup:">
              <div className="text-sm text-gray-400 space-y-1 mt-1">
                <p>✅ RSI below 30 (oversold) OR bouncing from 40</p>
                <p>✅ MACD bullish crossover happening simultaneously</p>
                <p>✅ Price at a Fibonacci support level (0.618 ideal)</p>
                <p>✅ Volume increasing on the bounce</p>
              </div>
            </Card>
            <Card color="red" title="🎯 High Probability SELL Setup:">
              <div className="text-sm text-gray-400 space-y-1 mt-1">
                <p>✅ RSI above 70 (overbought) and starting to drop</p>
                <p>✅ MACD bearish crossover forming</p>
                <p>✅ Price at a Fibonacci extension target (1.618)</p>
                <p>✅ Volume decreasing on the rally (distribution)</p>
              </div>
            </Card>
          </div>
          <Card color="yellow" title="⚠️ Risk Management — Always Required">
            <p className="text-sm text-gray-400 mt-1">Never enter without a stop loss. RSI + MACD reduce risk but cannot guarantee outcomes. Risk maximum 1-2% of your portfolio per trade. Crypto markets can stay overbought or oversold longer than expected — patience is key.</p>
          </Card>
        </Section>

        <div className="py-12 text-center">
          <p className="text-xs text-gray-700 font-mono">CryptoPulse Learning · RSI + MACD Combo · Beginner Level</p>
        </div>
      </div>
    </div>
  );
}
