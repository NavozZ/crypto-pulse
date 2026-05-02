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
      <span className="text-sm font-semibold text-white">Elliott Wave Theory</span>
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

const waves = [
  { num: "1", type: "Motive", dir: "↑", color: "#4ade80", psychology: "Cautious Optimism", desc: "The hardest wave to spot. Often dismissed as a dead-cat bounce after a downtrend. Specialists begin accumulating.", fib: "N/A — starting wave", rules: ["Smallest of motive waves", "Often retraces most in Wave 2", "Volume should increase"] },
  { num: "2", type: "Corrective", dir: "↓", color: "#f87171", psychology: "Disbelief / Fear", desc: "Retail panic — many think the downtrend has resumed. Smart money accumulates more. Creates a higher low.", fib: "Retraces 50-61.8% of Wave 1", rules: ["Cannot go below Wave 1 start — IRON RULE", "Usually Zig-Zag (ABC)", "Volume decreases"] },
  { num: "3", type: "Motive", dir: "↑", color: "#4ade80", psychology: "Optimism → Euphoria", desc: "The longest and strongest wave. Public recognises the new trend. Huge volume. The wave traders make the most money in.", fib: "161.8%+ of Wave 1", rules: ["Cannot be the shortest motive wave — IRON RULE", "Usually the longest wave", "Highest volume"] },
  { num: "4", type: "Corrective", dir: "↓", color: "#f87171", psychology: "Complacency", desc: "Profit taking by early buyers. Often sideways. Retail buys the 'dip'. Shallow correction compared to Wave 2.", fib: "38.2% of Wave 3", rules: ["Cannot overlap Wave 1 top (in non-leveraged markets)", "Usually Flat or Triangle", "Lower volume than Wave 3"] },
  { num: "5", type: "Motive", dir: "↑", color: "#4ade80", psychology: "FOMO / Peak Euphoria", desc: "Late buyers rush in on FOMO. Often divergence on RSI/MACD. Smart money distributing. Market feels 'can't lose'.", fib: "Equal to Wave 1 often", rules: ["Weakest impulse momentum", "RSI divergence common", "Distribution by smart money"] },
];

const corrective = [
  { name: "Zig-Zag (ABC)", desc: "Sharp correction. A=5 waves, B=3 waves, C=5 waves. C often equals A in length.", use: "Most common. Follows Wave 2 and Wave B." },
  { name: "Flat (ABC)", desc: "Sideways correction. A=3, B=3, C=5. B retraces nearly all of A. Expanding flat: B exceeds A start.", use: "Usually follows Wave 4. Less sharp." },
  { name: "Triangle (ABCDE)", desc: "5-wave sideways pattern. Contracting or expanding. Always precedes the final motive wave in the sequence.", use: "Wave 4 or Wave B of larger correction." },
  { name: "WXY Double Three", desc: "Two corrective patterns connected by a linking Wave X. Very complex. Common in crypto corrections.", use: "Extended corrections that confuse most traders." },
];

export default function ElliottWaveGuide() {
  const [activeWave, setActiveWave] = useState("3");

  const currentWave = waves.find(w => w.num === activeWave);

  return (
    <div className="min-h-screen bg-[#050010] text-white">
      <BackBar />
      <div className="max-w-4xl mx-auto px-6">

        {/* Hero */}
        <div className="min-h-[55vh] flex flex-col justify-center py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xs font-mono tracking-widest text-red-400 uppercase mb-6">Advanced Level · Cycle Analysis</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
            ELLIOTT<br /><span className="text-red-400">WAVE</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-gray-400 max-w-xl text-base leading-relaxed">
            Ralph Nelson Elliott's discovery that markets move in predictable fractal wave patterns, driven by mass human psychology. The most powerful — and most misused — analytical framework in trading.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-2 mt-8">
            {["5-Wave Impulse", "3-Wave Correction", "ABC Zig-Zag", "Fibonacci Ratios", "Wave Rules", "Fractal Nature"].map(t => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 border border-white/10 rounded text-gray-400">{t}</span>
            ))}
          </motion.div>
        </div>

        {/* Chapter 01 */}
        <Section num="Chapter 01" title="The 5-3 Wave Structure">
          <p className="text-gray-400 mb-8 max-w-xl">The complete Elliott Wave cycle: 5 motive waves followed by 3 corrective waves. This 8-wave sequence repeats at every timeframe — fractal by nature.</p>

          {/* Master wave diagram */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-5">Complete 5-3 Elliott Wave Cycle</p>
            <svg viewBox="0 0 750 250" className="w-full">
              {/* Price path */}
              <polyline
                points="30,210 130,160 170,190 300,60 360,100 500,20 550,65 620,40 680,120 730,95"
                fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinejoin="round"
              />

              {/* Wave number circles */}
              {[[30,220,"1"],[130,150,"2","#f87171"],[170,200,"2",""],[300,50,"3"],[360,90,"4","#f87171"],[500,10,"5"],[550,75,"A","#f87171"],[620,30,"B"],[680,130,"C","#f87171"]].map(([x,y,l,c],i) => {
                if (!l || l==="") return null;
                const col = c === "#f87171" ? "#f87171" : "#4ade80";
                const isCorr = ["A","B","C"].includes(l) || c === "#f87171";
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="14" fill={isCorr ? "rgba(248,113,113,0.2)" : "rgba(74,222,128,0.2)"}
                      stroke={col} strokeWidth="1.5"/>
                    <text x={x} y={y+5} fill={col} fontSize="12" fontWeight="800" textAnchor="middle">{l}</text>
                  </g>
                );
              })}

              {/* Divider — end of impulse */}
              <line x1="525" y1="15" x2="525" y2="230" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"/>
              <text x="260" y="240" fill="rgba(74,222,128,0.5)" fontSize="10" textAnchor="middle">IMPULSE PHASE (5 waves)</text>
              <text x="625" y="240" fill="rgba(248,113,113,0.5)" fontSize="10" textAnchor="middle">CORRECTIVE (ABC)</text>

              {/* Wave 2 cannot cross rule */}
              <line x1="30" y1="210" x2="200" y2="210" stroke="rgba(248,113,113,0.3)" strokeWidth="1" strokeDasharray="3,3"/>
              <text x="35" y="225" fill="rgba(248,113,113,0.4)" fontSize="8">W2 cannot cross this →</text>

              {/* Wave 4 cannot cross rule */}
              <line x1="130" y1="160" x2="530" y2="160" stroke="rgba(255,165,0,0.3)" strokeWidth="1" strokeDasharray="3,3"/>
              <text x="135" y="155" fill="rgba(255,165,0,0.4)" fontSize="8">W4 cannot overlap W1 top →</text>
            </svg>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card color="green" title="🟢 Motive Waves (1, 3, 5):">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Move WITH the trend</li>
                <li>• Each has 5 sub-waves</li>
                <li>• Wave 3 = longest, strongest</li>
                <li>• High volume</li>
              </ul>
            </Card>
            <Card color="red" title="🔴 Corrective Waves (2, 4, A, B, C):">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Move AGAINST the trend</li>
                <li>• Each has 3 sub-waves</li>
                <li>• Lower volume</li>
                <li>• More complex — many patterns</li>
              </ul>
            </Card>
          </div>
        </Section>

        {/* Chapter 02 */}
        <Section num="Chapter 02" title="Wave Personalities">
          <p className="text-gray-400 mb-6 max-w-xl">Each wave has a distinct psychology. Understanding this helps you identify your position in the cycle even without wave counts.</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {waves.map(w => (
              <button key={w.num} onClick={() => setActiveWave(w.num)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                  activeWave === w.num
                    ? w.type === "Motive"
                      ? "bg-green-500/20 border border-green-500/50 text-green-400"
                      : "bg-red-500/20 border border-red-500/50 text-red-400"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}>Wave {w.num}</button>
            ))}
          </div>

          {currentWave && (
            <motion.div key={activeWave} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black ${
                  currentWave.type === "Motive" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>{currentWave.num}</div>
                <div>
                  <p className="font-bold text-white">Wave {currentWave.num} — {currentWave.type} {currentWave.dir}</p>
                  <p className={`text-xs font-mono ${currentWave.type === "Motive" ? "text-green-400" : "text-red-400"}`}>{currentWave.psychology}</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">{currentWave.desc}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase mb-2">Fibonacci Target:</p>
                  <p className="text-sm text-amber-400 font-semibold">{currentWave.fib}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase mb-2">Rules:</p>
                  <ul className="space-y-1">
                    {currentWave.rules.map(r => (
                      <li key={r} className="text-xs text-gray-400 flex gap-1.5"><span style={{ color: currentWave.color }}>›</span>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </Section>

        {/* Chapter 03 */}
        <Section num="Chapter 03" title="The 3 Iron Rules">
          <p className="text-gray-400 mb-6 max-w-xl">These rules are absolute. If your wave count violates any of them, your count is wrong — start over.</p>
          <div className="space-y-4 mb-8">
            {[
              { rule: "Rule 1", text: "Wave 2 NEVER retraces more than 100% of Wave 1", detail: "If it does, Wave 1 wasn't Wave 1. Find a new count.", color: "red" },
              { rule: "Rule 2", text: "Wave 3 is NEVER the shortest impulse wave", detail: "Wave 3 must be longer than either Wave 1 or Wave 5 (or both). Usually it's the longest.", color: "red" },
              { rule: "Rule 3", text: "Wave 4 NEVER overlaps Wave 1's price territory", detail: "Exception: diagonal triangles and leveraged/derivative markets. In spot crypto this rule holds.", color: "red" },
            ].map(({ rule, text, detail, color }) => (
              <div key={rule} className="flex gap-4 bg-white/[0.03] border border-red-500/20 rounded-xl p-5">
                <span className="text-xs font-mono text-red-400 font-bold w-16 flex-shrink-0">{rule}</span>
                <div>
                  <p className="font-semibold text-white text-sm mb-1">{text}</p>
                  <p className="text-xs text-gray-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Chapter 04 */}
        <Section num="Chapter 04" title="Corrective Patterns">
          <p className="text-gray-400 mb-6 max-w-xl">Corrections are more complex than impulses. These 4 patterns cover 95% of what you'll see.</p>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {corrective.map(({ name, desc, use }) => (
              <div key={name} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-red-500/20 transition">
                <p className="font-bold text-white text-sm mb-2">{name}</p>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">{desc}</p>
                <p className="text-xs font-mono text-red-400">Use case: {use}</p>
              </div>
            ))}
          </div>
          <Card color="amber" title="⚡ Modern Crypto Adaptation:">
            <p className="text-sm text-gray-400 mt-1">In today's algorithmic crypto markets, 3-wave moves are MORE common than 5-wave moves. Many bull runs unfold in corrective structures (3 waves repeating in the same direction). Don't force every move into a 5-wave count. If you can't find a clean 5 — label it as a 3-wave move in the larger trend direction.</p>
          </Card>
        </Section>

        <div className="py-12 text-center">
          <p className="text-xs text-gray-700 font-mono">CryptoPulse Learning · Elliott Wave Theory · Advanced Level</p>
        </div>
      </div>
    </div>
  );
}
