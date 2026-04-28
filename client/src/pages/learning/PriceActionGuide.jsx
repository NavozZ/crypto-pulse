import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Shared Components ──────────────────────────────────────────────────────
const BackBar = ({ level, title }) => {
  const nav = useNavigate();
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10 px-6 py-3 flex items-center gap-4">
      <button onClick={() => nav("/learning")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
        <ArrowLeft size={16} /> Back to Learning
      </button>
      <div className="h-4 w-px bg-white/20" />
      <span className="text-xs font-mono text-green-400 uppercase tracking-widest">{level}</span>
      <span className="text-sm font-semibold text-white">{title}</span>
    </div>
  );
};

const Section = ({ num, title, children, color = "text-green-400" }) => (
  <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
    className="py-16 border-t border-white/10">
    <p className={`text-xs font-mono tracking-widest uppercase mb-2 ${color}`}>{num}</p>
    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{title}</h2>
    {children}
  </motion.section>
);

const Card = ({ color = "green", title, children }) => {
  const s = { green: "border-l-green-400 bg-green-500/5", red: "border-l-red-400 bg-red-500/5", amber: "border-l-amber-400 bg-amber-500/5", blue: "border-l-blue-400 bg-blue-500/5", purple: "border-l-purple-400 bg-purple-500/5" };
  return (
    <div className={`border-l-4 rounded-r-xl p-5 ${s[color]}`}>
      {title && <p className="font-bold text-white mb-2">{title}</p>}
      {children}
    </div>
  );
};

const CandlePatternCard = ({ name, bias, description, color }) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition">
    <div className={`inline-block text-xs font-mono px-2 py-1 rounded mb-3 ${color === "green" ? "bg-green-500/10 text-green-400" : color === "red" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>
      {bias}
    </div>
    <h4 className="font-bold text-white mb-2">{name}</h4>
    <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
  </div>
);

export default function PriceActionGuide() {
  const [activeCandle, setActiveCandle] = useState("doji");

  const candles = {
    doji:      { name: "Doji", desc: "Open ≈ Close. Indecision — buyers and sellers equal. Watch for direction after.", bias: "Neutral" },
    hammer:    { name: "Hammer", desc: "Long lower wick, small body at top. Buyers rejected lower prices — bullish reversal signal.", bias: "Bullish" },
    engulfing: { name: "Bullish Engulfing", desc: "Green candle body completely engulfs the previous red candle. Strong reversal from sellers to buyers.", bias: "Bullish" },
    shooting:  { name: "Shooting Star", desc: "Long upper wick, small body at bottom. Sellers rejected higher prices — bearish reversal.", bias: "Bearish" },
    bearengulf:{ name: "Bearish Engulfing", desc: "Red candle body completely engulfs previous green candle. Strong reversal from buyers to sellers.", bias: "Bearish" },
  };

  return (
    <div className="min-h-screen bg-[#050010] text-white">
      <BackBar level="Beginner" title="Price Action & Support / Resistance" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <div className="min-h-[55vh] flex flex-col justify-center py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xs font-mono tracking-widest text-green-400 uppercase mb-6">Beginner Level · Foundation Skills</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-6">
            PRICE<br /><span className="text-green-400">ACTION</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-gray-400 max-w-xl text-base leading-relaxed">
            The most fundamental trading skill — reading raw candles, identifying key levels, and trading breakouts with confidence. No indicators needed. Just price.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-2 mt-8">
            {["Candlestick Patterns", "Support & Resistance", "Trend Lines", "Breakouts", "Fakeouts", "Volume"].map(t => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 border border-white/10 rounded text-gray-400">{t}</span>
            ))}
          </motion.div>
        </div>

        {/* Chapter 01 */}
        <Section num="Chapter 01" title="Candlestick Fundamentals">
          <p className="text-gray-400 mb-8 max-w-xl">Every candle tells the story of the battle between buyers and sellers in a given period. Learn to read that story before anything else.</p>

          {/* Candle anatomy SVG */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-5">Anatomy of a Candlestick</p>
            <svg viewBox="0 0 700 220" className="w-full">
              {/* Bullish candle */}
              <line x1="130" y1="30" x2="130" y2="195" stroke="rgba(74,222,128,0.3)" strokeWidth="1" strokeDasharray="3,3"/>
              <line x1="130" y1="40" x2="130" y2="70" stroke="#4ade80" strokeWidth="2"/>
              <rect x="110" y="70" width="40" height="90" fill="rgba(74,222,128,0.2)" stroke="#4ade80" strokeWidth="2" rx="2"/>
              <line x1="130" y1="160" x2="130" y2="190" stroke="#4ade80" strokeWidth="2"/>
              <text x="165" y="44" fill="rgba(255,255,255,0.5)" fontSize="11">Upper wick (High)</text>
              <text x="165" y="80" fill="#4ade80" fontSize="11" fontWeight="600">Close ↑ (Bullish)</text>
              <text x="165" y="120" fill="rgba(255,255,255,0.4)" fontSize="11">Body = Open→Close</text>
              <text x="165" y="158" fill="rgba(255,255,255,0.5)" fontSize="11">Open (Bullish)</text>
              <text x="165" y="190" fill="rgba(255,255,255,0.5)" fontSize="11">Lower wick (Low)</text>
              <text x="90" y="215" fill="#4ade80" fontSize="12" fontWeight="700" textAnchor="middle">BULLISH</text>

              {/* Bearish candle */}
              <line x1="450" y1="40" x2="450" y2="70" stroke="#f87171" strokeWidth="2"/>
              <rect x="430" y="70" width="40" height="90" fill="rgba(248,113,113,0.2)" stroke="#f87171" strokeWidth="2" rx="2"/>
              <line x1="450" y1="160" x2="450" y2="190" stroke="#f87171" strokeWidth="2"/>
              <text x="500" y="44" fill="rgba(255,255,255,0.5)" fontSize="11">Upper wick (High)</text>
              <text x="500" y="80" fill="#f87171" fontSize="11" fontWeight="600">Open (Bearish)</text>
              <text x="500" y="120" fill="rgba(255,255,255,0.4)" fontSize="11">Body = Open→Close</text>
              <text x="500" y="158" fill="#f87171" fontSize="11" fontWeight="600">Close ↓ (Bearish)</text>
              <text x="500" y="190" fill="rgba(255,255,255,0.5)" fontSize="11">Lower wick (Low)</text>
              <text x="450" y="215" fill="#f87171" fontSize="12" fontWeight="700" textAnchor="middle">BEARISH</text>
            </svg>
          </div>

          {/* Key questions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { q: "Where did price close?", a: "Above open = bullish. Below open = bearish. Closing level is the most important price.", color: "green" },
              { q: "How big is the body?", a: "Large body = strong conviction. Small body = indecision or balance between buyers/sellers.", color: "amber" },
              { q: "How long are the wicks?", a: "Long wick = rejection. Price went there but was pushed back — that level was tested and failed.", color: "blue" },
            ].map(({ q, a, color }) => (
              <Card key={q} color={color} title={q}><p className="text-sm text-gray-400">{a}</p></Card>
            ))}
          </div>
        </Section>

        {/* Chapter 02 - Patterns */}
        <Section num="Chapter 02" title="Key Candlestick Patterns">
          <p className="text-gray-400 mb-8 max-w-xl">These 5 patterns appear repeatedly in crypto. Learn to recognise them instantly — they signal potential reversals and continuations.</p>

          {/* Interactive pattern selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(candles).map(([key, val]) => (
              <button key={key} onClick={() => setActiveCandle(key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeCandle === key ? "bg-green-500/20 border border-green-500/50 text-green-400" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}>{val.name}</button>
            ))}
          </div>

          <motion.div key={activeCandle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
              candles[activeCandle].bias === "Bullish" ? "bg-green-500/10 text-green-400" :
              candles[activeCandle].bias === "Bearish" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"
            }`}>{candles[activeCandle].bias}</div>
            <h3 className="text-xl font-bold text-white mb-3">{candles[activeCandle].name}</h3>
            <p className="text-gray-400">{candles[activeCandle].desc}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            <CandlePatternCard name="Pin Bar / Hammer" bias="Bullish" color="green" description="Long lower wick (2× body minimum). Rejection of lower prices. Best at support levels or after downtrend." />
            <CandlePatternCard name="Bearish Engulfing" bias="Bearish" color="red" description="Red body completely swallows previous green body. Buyers exhausted — sellers take control. Best at resistance." />
            <CandlePatternCard name="Morning Star" bias="Bullish" color="green" description="3-candle pattern: big red, small indecision, big green. Classic bottom reversal — very reliable." />
            <CandlePatternCard name="Evening Star" bias="Bearish" color="red" description="3-candle pattern: big green, small indecision, big red. Classic top reversal — look for volume increase on red candle." />
          </div>
        </Section>

        {/* Chapter 03 - Support & Resistance */}
        <Section num="Chapter 03" title="Support & Resistance">
          <p className="text-gray-400 mb-8 max-w-xl">Key price levels where the market has repeatedly bounced or reversed. These are the most powerful zones in all of trading.</p>

          {/* S/R SVG */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-5">Support & Resistance — Role Reversal</p>
            <svg viewBox="0 0 750 280" className="w-full">
              {/* Resistance line */}
              <line x1="30" y1="80" x2="720" y2="80" stroke="#f87171" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.7"/>
              <text x="730" y="84" fill="#f87171" fontSize="11">Resistance</text>
              {/* Support line */}
              <line x1="30" y1="200" x2="720" y2="200" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.7"/>
              <text x="730" y="204" fill="#4ade80" fontSize="11">Support</text>

              {/* Price bouncing off support */}
              <polyline points="30,200 80,160 130,200 180,150 230,200 280,130 330,80"
                fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinejoin="round"/>
              {/* Breakout through resistance */}
              <polyline points="330,80 380,60 430,70 480,50 530,65"
                fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinejoin="round"/>
              {/* Role reversal — old resistance becomes support */}
              <polyline points="530,65 580,85 630,78 680,88 720,75"
                fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinejoin="round"/>

              {/* Annotations */}
              <text x="60" y="220" fill="#4ade80" fontSize="10">Bounce ×3</text>
              <text x="335" y="65" fill="#facc15" fontSize="11" fontWeight="700">Breakout!</text>
              <text x="555" y="105" fill="#a855f7" fontSize="11">Role Reversal</text>
              <text x="555" y="118" fill="#a855f7" fontSize="10">Old resistance = new support</text>

              {/* Breakout circle */}
              <circle cx="330" cy="80" r="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
              {/* Role reversal zone */}
              <rect x="525" y="68" width="205" height="28" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.3)" strokeWidth="1" rx="4"/>
            </svg>
          </div>

          <div className="space-y-4">
            <Card color="green" title="✅ Strong Support Zone (High Probability Bounce):">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Price bounced from this level 2+ times before</li>
                <li>• High volume at the bounce points</li>
                <li>• Round number (e.g. $80,000, $50,000)</li>
                <li>• Coincides with a Fibonacci level (0.618 ideal)</li>
                <li>• Previous resistance now acting as support (role reversal)</li>
              </ul>
            </Card>
            <Card color="amber" title="⚠️ How Levels Get Broken:">
              <p className="text-sm text-gray-400">High volume candle closing cleanly through the level = real break. Low volume spike through the level = likely fakeout. Wait for the candle to close, not just touch the level.</p>
            </Card>
          </div>
        </Section>

        {/* Chapter 04 - Trend Lines */}
        <Section num="Chapter 04" title="Trend Lines & Channels">
          <p className="text-gray-400 mb-8 max-w-xl">Connect the swing points to draw the trend. Trade with the trend, not against it.</p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {[
              { title: "Uptrend Channel", color: "green", rules: ["Connect at least 2 swing lows for support line", "Draw parallel line through swing highs", "Buy near lower channel line", "Take profit near upper channel line", "Break below lower line = trend broken"] },
              { title: "Downtrend Channel", color: "red", rules: ["Connect at least 2 swing highs for resistance line", "Draw parallel line through swing lows", "Short near upper channel line", "Cover near lower channel line", "Break above upper line = trend broken"] },
            ].map(({ title, color, rules }) => (
              <Card key={title} color={color} title={title}>
                <ul className="text-sm text-gray-400 space-y-1 mt-1">
                  {rules.map(r => <li key={r}>• {r}</li>)}
                </ul>
              </Card>
            ))}
          </div>

          <Card color="purple" title="💡 The Rule of 3 Touches">
            <p className="text-sm text-gray-400 mt-1">A trend line needs at least 3 touches to be considered valid and reliable. Two points define any line — the third touch confirms it as a real trend line. More touches = stronger level. A break of a 5+ touch trend line is a very significant signal.</p>
          </Card>
        </Section>

        {/* Chapter 05 */}
        <Section num="Chapter 05" title="Breakouts & Fakeouts">
          <div className="space-y-4">
            <Card color="green" title="✅ Real Breakout Checklist:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Candle closes above/below the level (not just wicks through)</li>
                <li>• High volume on the breakout candle (ideally 2× average)</li>
                <li>• Retest of broken level as new support/resistance</li>
                <li>• Strong momentum candles following the break</li>
              </ul>
            </Card>
            <Card color="red" title="❌ Fakeout Warning Signs:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Low volume spike through the level</li>
                <li>• Long wick through level but closes back inside</li>
                <li>• Price quickly reverses within 1-2 candles</li>
                <li>• Breaks during low liquidity hours</li>
              </ul>
            </Card>
            <Card color="amber" title="🎯 Fakeout Trade Setup:">
              <p className="text-sm text-gray-400 mt-1">Fakeouts are actually high-probability trades. When price spikes through a key level (stop hunt) then reverses back — enter in the direction of the reversal. The trapped traders provide the fuel for the move. This is the "liquidity sweep" in SMC terminology.</p>
            </Card>
          </div>
        </Section>

        <div className="py-12 text-center">
          <p className="text-xs text-gray-700 font-mono">CryptoPulse Learning · Price Action & S/R · Beginner Level</p>
        </div>
      </div>
    </div>
  );
}
