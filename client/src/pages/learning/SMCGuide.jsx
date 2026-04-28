import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackBar = () => {
  const nav = useNavigate();
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10 px-6 py-3 flex items-center gap-4">
      <button onClick={() => nav("/learning")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
        <ArrowLeft size={16} /> Back to Learning
      </button>
      <div className="h-4 w-px bg-white/20" />
      <span className="text-xs font-mono text-red-400 uppercase tracking-widest">Advanced</span>
      <span className="text-sm font-semibold text-white">Smart Money Concepts</span>
    </div>
  );
};

const Section = ({ num, title, children }) => (
  <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
    className="py-16 border-t border-white/10">
    <p className="text-xs font-mono tracking-widest text-red-400 uppercase mb-2">{num}</p>
    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{title}</h2>
    {children}
  </motion.section>
);

const Card = ({ color = "red", title, children }) => {
  const s = { red: "border-l-red-400 bg-red-500/5", green: "border-l-green-400 bg-green-500/5", amber: "border-l-amber-400 bg-amber-500/5", blue: "border-l-blue-400 bg-blue-500/5", purple: "border-l-purple-400 bg-purple-500/5" };
  return (
    <div className={`border-l-4 rounded-r-xl p-5 ${s[color]}`}>
      {title && <p className="font-bold text-white mb-2">{title}</p>}
      {children}
    </div>
  );
};

const smcConcepts = {
  "Order Blocks": {
    color: "text-blue-400",
    short: "The last candle before a strong impulsive move. This is where Smart Money placed their orders — price returns to these zones.",
    detail: [
      "Bullish OB: Last red candle before a strong bullish impulse",
      "Bearish OB: Last green candle before a strong bearish impulse",
      "Price returns to these zones to fill remaining orders",
      "Entry: when price returns to the OB zone",
      "Confirmation: look for reaction candle at the OB",
    ],
  },
  "Fair Value Gap": {
    color: "text-green-400",
    short: "A price imbalance caused by strong impulsive moves — three-candle pattern where the middle candle moves so fast it leaves a gap in liquidity.",
    detail: [
      "FVG = gap between candle 1's high and candle 3's low (bullish)",
      "FVG = gap between candle 1's low and candle 3's high (bearish)",
      "Price tends to return to fill these gaps",
      "50% of FVG is the ideal entry zone",
      "FVG + Order Block overlap = very high probability setup",
    ],
  },
  "Liquidity Zones": {
    color: "text-yellow-400",
    short: "Areas where retail traders cluster their stop losses. Smart Money deliberately sweeps these levels to grab liquidity before reversing.",
    detail: [
      "Equal highs/lows = obvious stop loss clusters (retail traps)",
      "Previous swing highs/lows = liquidity pools",
      "Round numbers ($50k, $80k) = psychological liquidity",
      "Smart Money sweeps liquidity THEN reverses",
      "A wick through a key level = liquidity sweep signal",
    ],
  },
  "BOS / CHoCH": {
    color: "text-purple-400",
    short: "Market structure signals. BOS = trend continuation. CHoCH = trend reversal. These define the directional bias for all trades.",
    detail: [
      "BOS (Break of Structure): Price breaks past a previous swing high/low — trend continues",
      "CHoCH (Change of Character): Price breaks in the OPPOSITE direction — trend reversal",
      "In uptrend: look for bullish BOS above swing highs",
      "CHoCH signals: start looking for trades in the new direction",
      "Higher timeframe BOS > lower timeframe CHoCH in importance",
    ],
  },
};

export default function SMCGuide() {
  const [active, setActive] = useState("Order Blocks");

  return (
    <div className="min-h-screen bg-[#050010] text-white">
      <BackBar />
      <div className="max-w-4xl mx-auto px-6">

        {/* Hero */}
        <div className="min-h-[55vh] flex flex-col justify-center py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xs font-mono tracking-widest text-red-400 uppercase mb-6">Advanced Level · Institutional Trading</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-5xl md:text-8xl font-black leading-none tracking-tight mb-6">
            SMART<br /><span className="text-red-400">MONEY</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-gray-400 max-w-xl text-base leading-relaxed">
            Smart Money Concepts (SMC) reverse-engineers how institutional traders — banks, hedge funds, market makers — manipulate markets to fill their massive orders. Stop trading like retail. Start reading like institutions.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-2 mt-8">
            {["Order Blocks", "Fair Value Gaps", "Liquidity Sweeps", "BOS / CHoCH", "Premium & Discount", "Multi-Timeframe"].map(t => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 border border-white/10 rounded text-gray-400">{t}</span>
            ))}
          </motion.div>
        </div>

        {/* Chapter 01 */}
        <Section num="Chapter 01" title="Market Structure — BOS & CHoCH">
          <p className="text-gray-400 mb-8 max-w-xl">Before any SMC concept, you must understand market structure. Every trade begins by identifying what structure the market is in.</p>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-5">BOS vs CHoCH — Structure Diagram</p>
            <svg viewBox="0 0 750 230" className="w-full">
              {/* Uptrend with BOS markers */}
              <polyline points="30,190 80,160 130,170 180,130 230,140 280,100 330,110 380,65 430,75"
                fill="none" stroke="rgba(74,222,128,0.8)" strokeWidth="2.5" strokeLinejoin="round"/>
              {/* HH HL labels */}
              {[[80,155,"HL"],[130,167,"HL"],[180,127,"HH"],[230,137,"HL"],[280,97,"HH"],[380,62,"HH"]].map(([x,y,l]) => (
                <text key={`${x}${l}`} x={x-8} y={y-8} fill={l==="HH"?"#4ade80":"rgba(74,222,128,0.6)"} fontSize="9" fontWeight="600">{l}</text>
              ))}
              {/* BOS arrows */}
              {[[180,"BOS"],[280,"BOS"],[380,"BOS"]].map(([x,l]) => (
                <g key={x}>
                  <line x1={x} y1={82} x2={x} y2={95} stroke="#4ade80" strokeWidth="1.5"/>
                  <text x={x} y={78} fill="#4ade80" fontSize="9" textAnchor="middle">{l}</text>
                </g>
              ))}

              {/* CHoCH reversal */}
              <polyline points="430,75 470,100 510,85 550,130 600,120 650,165 700,160"
                fill="none" stroke="rgba(248,113,113,0.8)" strokeWidth="2.5" strokeLinejoin="round"/>
              <text x="460" y="75" fill="#f87171" fontSize="11" fontWeight="800">CHoCH</text>
              <text x="460" y="88" fill="rgba(248,113,113,0.5)" fontSize="9">Trend reversal</text>

              {/* CHoCH circle */}
              <circle cx="430" cy="75" r="15" fill="none" stroke="#f87171" strokeWidth="1.5"/>

              {/* Divider */}
              <line x1="430" y1="40" x2="430" y2="220" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"/>
              <text x="250" y="215" fill="rgba(74,222,128,0.6)" fontSize="10" textAnchor="middle">UPTREND — Multiple BOS</text>
              <text x="565" y="215" fill="rgba(248,113,113,0.6)" fontSize="10" textAnchor="middle">DOWNTREND after CHoCH</text>
            </svg>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card color="green" title="BOS — Break of Structure:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Price breaks past the PREVIOUS swing high (uptrend)</li>
                <li>• Confirms the existing trend continues</li>
                <li>• Look for pullback entry after BOS</li>
                <li>• Multiple BOS = very strong trend</li>
              </ul>
            </Card>
            <Card color="red" title="CHoCH — Change of Character:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Price breaks OPPOSITE to the current trend</li>
                <li>• In uptrend: price breaks a swing low = CHoCH</li>
                <li>• Signals possible trend reversal — change bias</li>
                <li>• One CHoCH = warning. Two = confirmation</li>
              </ul>
            </Card>
          </div>
        </Section>

        {/* Chapter 02 */}
        <Section num="Chapter 02" title="Core SMC Concepts">
          <p className="text-gray-400 mb-6 max-w-xl">Four essential concepts. Master these before attempting SMC trades.</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(smcConcepts).map(k => (
              <button key={k} onClick={() => setActive(k)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  active === k ? "bg-red-500/20 border border-red-500/50 text-red-400" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}>{k}</button>
            ))}
          </div>

          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <p className={`text-sm font-mono mb-3 ${smcConcepts[active].color}`}>{active}</p>
            <p className="text-gray-300 mb-5">{smcConcepts[active].short}</p>
            <div className="space-y-2">
              {smcConcepts[active].detail.map(d => (
                <p key={d} className="text-sm text-gray-500 flex gap-2"><span className="text-red-400 flex-shrink-0">›</span>{d}</p>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* Chapter 03 - Premium & Discount */}
        <Section num="Chapter 03" title="Premium & Discount Zones">
          <p className="text-gray-400 mb-8 max-w-xl">Smart Money buys in discount and sells in premium. Every swing range has a 50% equilibrium — below is discount (buy zone), above is premium (sell zone).</p>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
            <svg viewBox="0 0 650 180" className="w-full">
              {/* Range box */}
              <rect x="50" y="30" width="550" height="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="4"/>
              {/* 50% line */}
              <line x1="50" y1="90" x2="600" y2="90" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4"/>
              <text x="608" y="94" fill="#facc15" fontSize="11">50% EQ</text>
              {/* Top */}
              <text x="608" y="34" fill="#f87171" fontSize="11">100% — Swing High</text>
              <text x="30" y="34" fill="#f87171" fontSize="10">PREMIUM</text>
              <text x="30" y="50" fill="rgba(248,113,113,0.5)" fontSize="9">SM sells here</text>
              {/* Premium zone */}
              <rect x="51" y="31" width="548" height="58" fill="rgba(248,113,113,0.05)" rx="3"/>
              {/* Discount zone */}
              <rect x="51" y="91" width="548" height="58" fill="rgba(74,222,128,0.05)" rx="3"/>
              <text x="30" y="140" fill="#4ade80" fontSize="10">DISCOUNT</text>
              <text x="30" y="153" fill="rgba(74,222,128,0.5)" fontSize="9">SM buys here</text>
              <text x="608" y="152" fill="#4ade80" fontSize="11">0% — Swing Low</text>

              {/* Price action in range */}
              <polyline points="100,140 160,80 220,125 280,60 340,130 400,70 460,120 520,55 575,85"
                fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>

          <Card color="amber" title="🎯 Trading Rule:">
            <p className="text-sm text-gray-400 mt-1">Only BUY in discount zones (below 50% of the range). Only SELL in premium zones (above 50%). When you see an Order Block or FVG in a discount zone = highest probability long setup. OB + FVG in premium = highest probability short setup.</p>
          </Card>
        </Section>

        {/* Chapter 04 */}
        <Section num="Chapter 04" title="Full SMC Trade Setup">
          <div className="space-y-4">
            <Card color="green" title="✅ Complete Bullish SMC Setup:">
              <ol className="text-sm text-gray-400 space-y-1.5 mt-1 list-none">
                {["Higher timeframe (4H/Daily): Uptrend confirmed — multiple bullish BOS", "Structure: Price pulls back — CHoCH NOT formed (trend intact)", "Zone: Pullback enters DISCOUNT zone (below 50% of swing range)", "Confluence: Pullback hits a Bullish Order Block AND/OR FVG in the zone", "Liquidity: Previous swing low equal low swept (liquidity grab) before entry", "Entry: Reaction candle (bullish engulfing) at the OB/FVG zone", "Stop loss: Below the Order Block (or below the liquidity low)", "Target: Previous swing high (next liquidity pool)"].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-green-400 font-mono text-xs mt-0.5">{i+1}.</span>{s}</li>
                ))}
              </ol>
            </Card>
            <Card color="red" title="⚠️ Common SMC Mistakes:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Trading Order Blocks without structure context</li>
                <li>• Entering before liquidity is swept (getting stopped out)</li>
                <li>• Ignoring the higher timeframe trend direction</li>
                <li>• Trading every FVG — only trade FVGs with OB confluence in the right zone</li>
                <li>• Forgetting risk management — even SMC setups fail</li>
              </ul>
            </Card>
          </div>
        </Section>

        <div className="py-12 text-center">
          <p className="text-xs text-gray-700 font-mono">CryptoPulse Learning · Smart Money Concepts · Advanced Level</p>
        </div>
      </div>
    </div>
  );
}
