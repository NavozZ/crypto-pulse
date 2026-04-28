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
      <span className="text-sm font-semibold text-white">On-Chain Analysis</span>
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

const MetricCard = ({ name, full, signal, when, zone, color }) => {
  const [open, setOpen] = useState(false);
  const c = { green: "text-green-400 bg-green-500/10 border-green-500/30", red: "text-red-400 bg-red-500/10 border-red-500/30", yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" };
  return (
    <div onClick={() => setOpen(!open)} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 cursor-pointer hover:border-white/20 transition">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${c[color]}`}>{name}</span>
        <span className="text-gray-600 text-xs">{open ? "▲" : "▼"} details</span>
      </div>
      <p className="text-sm font-semibold text-white">{full}</p>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-white/10 space-y-2">
          <p className="text-xs text-gray-400"><span className="text-white font-semibold">Signal: </span>{signal}</p>
          <p className="text-xs text-gray-400"><span className="text-white font-semibold">When to use: </span>{when}</p>
          <p className="text-xs text-gray-400"><span className="text-white font-semibold">Zones: </span>{zone}</p>
        </motion.div>
      )}
    </div>
  );
};

const metrics = [
  {
    name: "NUPL", full: "Net Unrealised Profit/Loss", color: "yellow",
    signal: "Measures overall profit/loss state of all Bitcoin holders. High NUPL = most holders in profit = distribution risk. Negative NUPL = holders in loss = capitulation / accumulation opportunity.",
    when: "Best at macro turning points — tops and bottoms of major cycles.",
    zone: "Euphoria (>0.75) = near top. Capitulation (<0) = near bottom. Optimism (0.5-0.75) = mid bull.",
  },
  {
    name: "MVRV", full: "Market Value to Realised Value", color: "green",
    signal: "Compares current market cap to realised cap (what holders paid for coins). MVRV >3 = historically overvalued. MVRV <1 = undervalued — below cost basis of average holder.",
    when: "Cycle tops and bottoms. Most reliable on weekly/monthly timeframe.",
    zone: "MVRV >3.5 = extreme overvaluation (consider taking profits). MVRV <1 = accumulation zone.",
  },
  {
    name: "SOPR", full: "Spent Output Profit Ratio", color: "blue",
    signal: "Measures average profit/loss of coins moved on-chain. SOPR >1 = coins moved in profit. SOPR <1 = coins moved at a loss. Bullish: SOPR bouncing off 1.0. Bearish: SOPR rejected at 1.0.",
    when: "Short to medium term signals. Best on daily/weekly chart.",
    zone: "SOPR bouncing at 1.0 in bull market = buy signal. SOPR rejecting 1.0 in bear = sell signal.",
  },
  {
    name: "Exchange Flow", full: "Exchange Inflow / Outflow", color: "red",
    signal: "Coins flowing TO exchanges = potential selling pressure (bearish). Coins flowing FROM exchanges = withdrawal for holding (bullish). Spike in exchange inflow often precedes price drops.",
    when: "Short term (days to weeks). Best for timing entries around large holder moves.",
    zone: "Large inflow spike = caution. Sustained outflow = bullish accumulation signal.",
  },
];

export default function OnChainGuide() {
  return (
    <div className="min-h-screen bg-[#050010] text-white">
      <BackBar />
      <div className="max-w-4xl mx-auto px-6">

        {/* Hero */}
        <div className="min-h-[55vh] flex flex-col justify-center py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xs font-mono tracking-widest text-yellow-400 uppercase mb-6">Intermediate · 2026 Must-Have Skill</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
            ON-CHAIN<br /><span className="text-yellow-400">ANALYSIS</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-gray-400 max-w-xl text-base leading-relaxed">
            Charts show you what price is doing. On-chain shows you WHO is doing it and with how much conviction. The blockchain is a public ledger — learn to read it and you gain an edge most traders never develop.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-2 mt-8">
            {["NUPL", "MVRV", "SOPR", "Exchange Flows", "Whale Tracking", "Funding Rate", "Open Interest"].map(t => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 border border-white/10 rounded text-gray-400">{t}</span>
            ))}
          </motion.div>
        </div>

        {/* Chapter 01 */}
        <Section num="Chapter 01" title="Why On-Chain Matters">
          <p className="text-gray-400 mb-8 max-w-xl">Every BTC and ETH transaction is permanently recorded on a public blockchain. On-chain analysis reads those records to understand real money flows — not price, but the underlying behaviour driving price.</p>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-5">On-Chain vs Technical Analysis</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <p className="text-xs font-mono text-blue-400 uppercase tracking-wider">Technical Analysis</p>
                {["Reads the price chart", "Price levels & structure", "Candle patterns & momentum", "S/R, trend lines, indicators", "Answers: WHAT is price doing?"].map(t => (
                  <p key={t} className="text-xs text-gray-400 flex gap-2"><span className="text-blue-400">›</span>{t}</p>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">+</div>
                  <p className="text-xs text-gray-500">Combined = Edge</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-mono text-yellow-400 uppercase tracking-wider">On-Chain Analysis</p>
                {["Reads the blockchain ledger", "Actual coin movements", "Who is buying / selling", "Profit/loss state of holders", "Answers: WHO and WHY?"].map(t => (
                  <p key={t} className="text-xs text-gray-400 flex gap-2"><span className="text-yellow-400">›</span>{t}</p>
                ))}
              </div>
            </div>
          </div>

          <Card color="yellow" title="🔑 The Key Advantage — On-Chain Leads Price:">
            <p className="text-sm text-gray-400 mt-1">When large holders start moving coins to exchanges, sell pressure is coming — often before the price chart shows any weakness. Reading this lets you position AHEAD of the move, not after it has already happened. This is why professional traders use on-chain data.</p>
          </Card>
        </Section>

        {/* Chapter 02 */}
        <Section num="Chapter 02" title="Core On-Chain Metrics">
          <p className="text-gray-400 mb-6 max-w-xl">Click each metric to expand details. Focus on NUPL and MVRV for macro timing — they are the most reliable cycle indicators.</p>
          <div className="space-y-3 mb-8">
            {metrics.map(m => <MetricCard key={m.name} {...m} />)}
          </div>
        </Section>

        {/* Chapter 03 */}
        <Section num="Chapter 03" title="Derivatives Data">
          <p className="text-gray-400 mb-8 max-w-xl">Futures and options markets give additional signals about market sentiment and positioning.</p>

          <div className="space-y-4">
            {[
              { name: "Funding Rate", signal: "Positive funding = longs paying shorts = market too long = potential squeeze down. Negative funding = shorts paying longs = market too short = potential short squeeze up.", color: "blue" },
              { name: "Open Interest (OI)", signal: "Rising OI + rising price = new longs entering = trend continuation. Rising OI + falling price = new shorts entering = strong downtrend. Falling OI = positions being closed = trend losing momentum.", color: "purple" },
              { name: "Long/Short Ratio", signal: "When 80%+ of positions are on one side, a reversal is likely — the market needs to stop out the majority. Extreme readings (>80% long or short) often precede violent reversals.", color: "green" },
            ].map(({ name, signal, color }) => (
              <Card key={name} color={color} title={`📊 ${name}`}>
                <p className="text-sm text-gray-400 mt-1">{signal}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* Chapter 04 */}
        <Section num="Chapter 04" title="Whale & Miner Data">
          <div className="space-y-4 mb-6">
            <Card color="red" title="🐋 Whale Wallet Tracking:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Addresses holding 1,000+ BTC are considered whales</li>
                <li>• Whale accumulation (addresses growing) = bullish</li>
                <li>• Whale distribution (addresses decreasing) = bearish</li>
                <li>• Large transactions to exchanges = sell pressure incoming</li>
                <li>• Tools: Glassnode, Nansen, Arkham Intelligence</li>
              </ul>
            </Card>
            <Card color="yellow" title="⛏️ Miner Behaviour:">
              <ul className="text-sm text-gray-400 space-y-1 mt-1">
                <li>• Miners must sell some BTC to cover electricity costs</li>
                <li>• Miner outflow spike = forced selling = price pressure</li>
                <li>• Miner capitulation = selling at a loss = bottoms often form here</li>
                <li>• After miner capitulation resolves = bullish signal</li>
                <li>• Hash ribbon indicator tracks miner capitulation events</li>
              </ul>
            </Card>
          </div>

          <Card color="green" title="🎯 Confluence Framework — Using Everything Together:">
            <div className="text-sm text-gray-400 space-y-1 mt-1">
              <p>Strong BUY signal when ALL align:</p>
              <p>✅ NUPL in Capitulation / Fear zone (&lt;0.25)</p>
              <p>✅ MVRV below 1.0 (below realised cap)</p>
              <p>✅ Exchange flows showing outflows (accumulation)</p>
              <p>✅ Funding rate negative (shorts dominant)</p>
              <p>✅ Price at major technical support (Fibonacci + S/R)</p>
            </div>
          </Card>
        </Section>

        <div className="py-12 text-center">
          <p className="text-xs text-gray-700 font-mono">CryptoPulse Learning · On-Chain Analysis · Intermediate Level</p>
        </div>
      </div>
    </div>
  );
}
