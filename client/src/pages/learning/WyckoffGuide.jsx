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
      <span className="text-xs font-mono text-yellow-400 uppercase tracking-widest">Intermediate</span>
      <span className="text-sm font-semibold text-white">Wyckoff Method</span>
    </div>
  );
};

const Section = ({ num, title, children }) => (
  <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
    className="py-16 border-t border-white/10">
    <p className="text-xs font-mono tracking-widest text-yellow-400 uppercase mb-2">{num}</p>
    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{title}</h2>
    {children}
  </motion.section>
);

const Card = ({ color = "yellow", title, children }) => {
  const s = { yellow: "border-l-yellow-400 bg-yellow-500/5", green: "border-l-green-400 bg-green-500/5", red: "border-l-red-400 bg-red-500/5", blue: "border-l-blue-400 bg-blue-500/5", purple: "border-l-purple-400 bg-purple-500/5" };
  return (
    <div className={`border-l-4 rounded-r-xl p-5 ${s[color]}`}>
      {title && <p className="font-bold text-white mb-2">{title}</p>}
      {children}
    </div>
  );
};

const phaseEvents = {
  PS:  "Preliminary Support — first sign that buying is entering the downtrend. Volume increases but price hasn't stopped falling yet.",
  SC:  "Selling Climax — panic selling, huge volume, price falls sharply. This is the bottom of the move. Emotional capitulation.",
  AR:  "Automatic Rally — prices bounce sharply after the SC as short sellers cover. This defines the top of the trading range.",
  ST:  "Secondary Test — price retests the SC area with lower volume. This confirms the SC was the bottom.",
  Spring: "Spring — a brief dip below the trading range support to trigger stop losses. Classic trap for retail traders. Low volume = fake move. This is the entry signal.",
  SOS: "Sign of Strength — price rallies on high volume above the trading range resistance. Confirms accumulation is complete.",
  LPS: "Last Point of Support — final pullback before markup. Higher low. Entry point for late buyers.",
};

export default function WyckoffGuide() {
  const [activeEvent, setActiveEvent] = useState("Spring");
  const [activePhase, setActivePhase] = useState("accumulation");

  return (
    <div className="min-h-screen bg-[#050010] text-white">
      <BackBar />
      <div className="max-w-4xl mx-auto px-6">

        {/* Hero */}
        <div className="min-h-[55vh] flex flex-col justify-center py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xs font-mono tracking-widest text-yellow-400 uppercase mb-6">Intermediate Level · Institutional Logic</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-6">
            WYCKOFF<br /><span className="text-yellow-400">METHOD</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-gray-400 max-w-xl text-base leading-relaxed">
            Richard Wyckoff's 100-year-old framework for understanding how large institutions — "Smart Money" — accumulate and distribute positions. Still the most accurate model for reading market cycles.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-2 mt-8">
            {["Composite Man", "Accumulation", "Distribution", "Spring", "UTAD", "Markup / Markdown"].map(t => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 border border-white/10 rounded text-gray-400">{t}</span>
            ))}
          </motion.div>
        </div>

        {/* Chapter 01 */}
        <Section num="Chapter 01" title="The Composite Man">
          <p className="text-gray-400 mb-8 max-w-xl">Wyckoff's core concept: imagine all large institutions act as ONE entity with perfect information and unlimited capital. This entity must engineer specific price conditions to fill its massive orders without moving the market against itself.</p>

          {/* Composite Man cycle SVG */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-5">The Wyckoff Market Cycle</p>
            <svg viewBox="0 0 750 200" className="w-full">
              {/* Phase labels */}
              {[
                { x: 80,  label: "Accumulation", color: "#4ade80",  action: "SM buys quietly"       },
                { x: 240, label: "Markup",        color: "#60a5fa",  action: "Retail joins late"     },
                { x: 420, label: "Distribution",  color: "#f87171",  action: "SM sells to euphoria"  },
                { x: 600, label: "Markdown",      color: "#f87171",  action: "Retail panics & sells" },
              ].map(({ x, label, color, action }) => (
                <g key={label}>
                  <text x={x} y="20" fill={color} fontSize="11" fontWeight="700" textAnchor="middle">{label}</text>
                  <text x={x} y="35" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">{action}</text>
                </g>
              ))}

              {/* Price line */}
              <polyline
                points="20,150 80,155 140,145 160,160 180,135 200,100 260,60 320,55 360,50 380,70 400,150 420,145 480,155 500,130 540,160 580,165 640,200 720,210"
                fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinejoin="round"
              />

              {/* Spring annotation */}
              <circle cx="160" cy="160" r="8" fill="none" stroke="#facc15" strokeWidth="1.5"/>
              <text x="150" y="182" fill="#facc15" fontSize="10">Spring</text>

              {/* UTAD annotation */}
              <circle cx="500" cy="130" r="8" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
              <text x="490" y="152" fill="#f59e0b" fontSize="10">UTAD</text>

              {/* Phase dividers */}
              {[195, 390, 555].map(x => (
                <line key={x} x1={x} y1="45" x2={x} y2="190" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"/>
              ))}
            </svg>
          </div>

          <Card color="yellow" title="💡 Why the Composite Man Needs a Range:">
            <p className="text-sm text-gray-400 mt-1">To buy 50,000 BTC without moving the price up, Smart Money must do it gradually during a sideways trading range. They create volatility within the range to shake out weak holders. This is accumulation. The Spring is the final trap — price dips below support to trigger retail stop losses, giving SM one last chance to buy cheap before markup.</p>
          </Card>
        </Section>

        {/* Chapter 02 - Accumulation */}
        <Section num="Chapter 02" title="Accumulation Schematic">
          <p className="text-gray-400 mb-8 max-w-xl">The accumulation phase has 5 distinct events. Learning to identify each one tells you exactly where you are in the cycle.</p>

          {/* Interactive event selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(phaseEvents).map(ev => (
              <button key={ev} onClick={() => setActiveEvent(ev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
                  activeEvent === ev ? "bg-yellow-500/20 border border-yellow-500/50 text-yellow-400" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}>{ev}</button>
            ))}
          </div>
          <motion.div key={activeEvent} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-yellow-500/20 rounded-2xl p-5 mb-8">
            <p className="text-xs font-mono text-yellow-400 mb-2">{activeEvent}</p>
            <p className="text-gray-300">{phaseEvents[activeEvent]}</p>
          </motion.div>

          {/* Accumulation SVG */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-5">Accumulation Schematic — Full Sequence</p>
            <svg viewBox="0 0 750 200" className="w-full">
              {/* Trading range */}
              <line x1="50" y1="60" x2="600" y2="60" stroke="#f87171" strokeWidth="1" strokeDasharray="5,4" opacity="0.6"/>
              <line x1="50" y1="150" x2="600" y2="150" stroke="#4ade80" strokeWidth="1" strokeDasharray="5,4" opacity="0.6"/>
              <text x="610" y="64" fill="#f87171" fontSize="10">AR top</text>
              <text x="610" y="154" fill="#4ade80" fontSize="10">SC low</text>

              {/* Price action */}
              <polyline points="30,20 60,150 100,60 140,140 180,120 220,145 260,90 300,110 340,130 360,165 400,50 440,85 480,65 520,80 560,55 600,40 680,30 740,20"
                fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinejoin="round"/>

              {/* Event labels */}
              <text x="50" y="170" fill="#a855f7" fontSize="9">SC</text>
              <text x="92" y="50" fill="#60a5fa" fontSize="9">AR</text>
              <text x="132" y="160" fill="#a855f7" fontSize="9">ST</text>
              <text x="350" y="185" fill="#facc15" fontSize="10" fontWeight="700">SPRING ↓</text>
              <text x="392" y="42" fill="#4ade80" fontSize="10" fontWeight="700">SOS ↑</text>
              <text x="477" y="55" fill="#4ade80" fontSize="9">LPS</text>

              {/* Markup arrow */}
              <line x1="600" y1="40" x2="680" y2="15" stroke="#4ade80" strokeWidth="2" markerEnd="url(#ga)"/>
              <defs><marker id="ga" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#4ade80"/></marker></defs>
              <text x="682" y="18" fill="#4ade80" fontSize="10" fontWeight="700">MARKUP</text>
            </svg>
          </div>
        </Section>

        {/* Chapter 03 */}
        <Section num="Chapter 03" title="Distribution Schematic">
          <p className="text-gray-400 mb-8 max-w-xl">The mirror of accumulation — SM sells its entire position to retail investors at the top, before driving price down.</p>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-5">Distribution Key Events</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { event: "PSY",  full: "Preliminary Supply",    desc: "First signs of heavy selling appearing after a long uptrend." },
                { event: "BC",   full: "Buying Climax",         desc: "Euphoric buying on huge volume. SM sells into this demand." },
                { event: "AR",   full: "Automatic Reaction",    desc: "Sharp drop after BC as SM supply overwhelms buyers." },
                { event: "ST",   full: "Secondary Test",        desc: "Price retests BC high on lower volume — distribution confirmed." },
                { event: "UTAD", full: "Up-Thrust After Dist.", desc: "False breakout above range to trap late buyers. The SM's final sell opportunity." },
                { event: "LPSY", full: "Last Point of Supply",  desc: "Last rally before markdown — lower high confirms weakness." },
              ].map(({ event, full, desc }) => (
                <div key={event} className="flex gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                  <span className="font-mono text-xs font-bold text-red-400 w-12 flex-shrink-0 mt-0.5">{event}</span>
                  <div>
                    <p className="text-xs font-semibold text-white">{full}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card color="red" title="🔴 UTAD — The Distribution Trap:">
            <p className="text-sm text-gray-400 mt-1">The UTAD is the most important event in distribution. Price breaks above the trading range (above BC high), triggering retail breakout buys and FOMO. Smart Money sells everything into this demand. Volume is high but price quickly reverses back inside the range — the breakout was fake. After the UTAD, markdown begins.</p>
          </Card>
        </Section>

        {/* Chapter 04 */}
        <Section num="Chapter 04" title="Wyckoff Laws">
          <div className="space-y-4">
            {[
              { law: "Law 1 — Supply & Demand", desc: "Price rises when demand exceeds supply, falls when supply exceeds demand. Seems obvious — Wyckoff adds: watch volume to confirm which force is stronger.", color: "yellow" },
              { law: "Law 2 — Cause & Effect", desc: "The amount of time spent in a trading range (cause) determines the magnitude of the subsequent move (effect). Longer accumulation = bigger markup. This is why ranging markets can explode unexpectedly.", color: "blue" },
              { law: "Law 3 — Effort vs Result", desc: "Volume = effort. Price change = result. High volume + small price move = absorption (SM absorbing supply). Low volume + large price move = no resistance. Divergences here reveal the next move.", color: "green" },
            ].map(({ law, desc, color }) => (
              <Card key={law} color={color} title={law}><p className="text-sm text-gray-400 mt-1">{desc}</p></Card>
            ))}
          </div>
        </Section>

        <div className="py-12 text-center">
          <p className="text-xs text-gray-700 font-mono">CryptoPulse Learning · Wyckoff Method · Intermediate Level</p>
        </div>
      </div>
    </div>
  );
}
