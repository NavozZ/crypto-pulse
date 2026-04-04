import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Lock, Unlock, Zap, Home, BarChart2,
  ChevronRight, Star, Users, Clock, CheckCircle,
} from "lucide-react";
import axios from "axios";
import PaymentModal from "../components/PaymentModal";
import { API_BASE } from "../api";

// ── Course definitions ─────────────────────────────────────────────────────
const COURSES = [
  {
    id:          "price-action",
    title:       "Price Action & Support/Resistance",
    subtitle:    "Candlesticks, key levels, trend lines, channels",
    level:       "Beginner",
    levelColor:  "#4ade80",
    bestFor:     "Entry / exit timing",
    timeframe:   "All timeframes",
    duration:    "45 min",
    topics:      ["Candlestick patterns", "Support & Resistance", "Trend lines", "Channels"],
    type:        "html",       // iframe embed
    file:        "/learning/price-action.html",
    route:       "/learning/price-action",
    free:        true,
  },
  {
    id:          "fibonacci",
    title:       "Fibonacci Retracement & Extension",
    subtitle:    "0.618, 0.5, 0.382 levels — targets at 1.618, 2.618",
    level:       "Beginner",
    levelColor:  "#4ade80",
    bestFor:     "Pullback zones, take profit",
    timeframe:   "4H / daily charts",
    duration:    "40 min",
    topics:      ["Golden ratio 0.618", "Retracement zones", "Extension targets", "Confluence trading"],
    type:        "react",
    route:       "/learning/fibonacci",
    free:        true,
  },
  {
    id:          "rsi-macd",
    title:       "RSI + MACD Combo",
    subtitle:    "Momentum confirmation, divergences, overbought/oversold",
    level:       "Beginner",
    levelColor:  "#4ade80",
    bestFor:     "Momentum confirmation",
    timeframe:   "1H / 4H charts",
    duration:    "50 min",
    topics:      ["RSI overbought/oversold", "MACD crossover", "Divergence", "Combined signals"],
    type:        "react",
    route:       "/learning/rsi-macd",
    free:        true,
  },
  {
    id:          "wyckoff",
    title:       "Wyckoff Method",
    subtitle:    "Accumulation, distribution, spring, UTAD phases",
    level:       "Intermediate",
    levelColor:  "#f59e0b",
    bestFor:     "Phase identification",
    timeframe:   "Daily / weekly charts",
    duration:    "75 min",
    topics:      ["Accumulation phases", "Distribution phases", "Spring & UTAD", "Composite operator"],
    type:        "html",
    file:        "/learning/wyckoff.html",
    route:       "/learning/wyckoff",
    free:        false,
  },
  {
    id:          "ichimoku",
    title:       "Ichimoku Cloud",
    subtitle:    "Cloud support/resistance, TK cross, chikou span",
    level:       "Intermediate",
    levelColor:  "#f59e0b",
    bestFor:     "Trend + momentum in one",
    timeframe:   "Daily / weekly charts",
    duration:    "60 min",
    topics:      ["Kumo cloud", "TK crossover", "Chikou span", "Kumo breakout"],
    type:        "react",
    route:       "/learning/ichimoku",
    free:        false,
  },
  {
    id:          "onchain",
    title:       "On-Chain Analysis",
    subtitle:    "SOPR, NUPL, exchange flows, whale wallet tracking",
    level:       "Intermediate",
    levelColor:  "#f59e0b",
    bestFor:     "Macro sentiment + conviction",
    timeframe:   "Weekly / monthly",
    duration:    "80 min",
    topics:      ["SOPR metric", "NUPL indicator", "Exchange flows", "Whale tracking"],
    type:        "html",
    file:        "/learning/onchain.html",
    route:       "/learning/onchain",
    free:        false,
  },
  {
    id:          "smc",
    title:       "Smart Money Concepts (SMC)",
    subtitle:    "Order blocks, BOS, FVG, liquidity sweeps",
    level:       "Advanced",
    levelColor:  "#f87171",
    bestFor:     "Institutional price action",
    timeframe:   "All timeframes",
    duration:    "90 min",
    topics:      ["Order blocks", "Break of structure", "Fair value gaps", "Liquidity zones"],
    type:        "html",
    file:        "/learning/smc.html",
    route:       "/learning/smc",
    free:        false,
  },
  {
    id:          "elliott-wave",
    title:       "Elliott Wave Theory",
    subtitle:    "5-wave impulse + 3-wave correction cycles",
    level:       "Advanced",
    levelColor:  "#f87171",
    bestFor:     "Macro cycle prediction",
    timeframe:   "Weekly / monthly charts",
    duration:    "100 min",
    topics:      ["Impulse waves 1-5", "Corrective waves ABC", "Wave rules", "Fibonacci ratios"],
    type:        "html",
    file:        "/learning/elliott-wave.html",
    route:       "/learning/elliott-wave",
    free:        false,
  },
];

const LEVEL_COLORS = {
  Beginner:     { bg: "bg-green-500/10",  border: "border-green-500/30",  text: "text-green-400"  },
  Intermediate: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400" },
  Advanced:     { bg: "bg-red-500/10",    border: "border-red-500/30",    text: "text-red-400"    },
};

export default function LearningPage() {
  const navigate        = useNavigate();
  const [searchParams]  = useSearchParams();
  const [userInfo,      setUserInfo]      = useState(null);
  const [subscription,  setSubscription]  = useState("free");
  const [paymentOpen,   setPaymentOpen]   = useState(false);
  const [filter,        setFilter]        = useState("All");

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!info) { navigate("/login"); return; }
    setUserInfo(info);

    // Fetch subscription status
    axios.get(`${API_BASE}/api/stripe/status`, {
      headers: { Authorization: `Bearer ${info.token}` }
    }).then(({ data }) => {
      setSubscription(data.subscription);
      // Update localStorage with latest subscription
      localStorage.setItem("userInfo", JSON.stringify({ ...info, subscription: data.subscription }));
    }).catch(() => setSubscription(info.subscription || "free"));
  }, [navigate]);

  // Handle return from Stripe redirect
  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setSubscription("pro");
    }
  }, [searchParams]);

  const isPro    = subscription === "pro" || userInfo?.role === "admin";
  const canAccess = (course) => course.free || isPro;

  const filtered = filter === "All" ? COURSES : COURSES.filter(c => c.level === filter);

  const handleCourseClick = (course) => {
    if (!canAccess(course)) {
      setPaymentOpen(true);
      return;
    }
    navigate(course.route);
  };

  const handlePaymentSuccess = () => {
    setSubscription("pro");
    const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
    localStorage.setItem("userInfo", JSON.stringify({ ...info, subscription: "pro" }));
  };

  if (!userInfo) return null;

  const stats = [
    { label: "Total Courses",     value: "8"         },
    { label: "Beginner Free",     value: "3"         },
    { label: "Pro Courses",       value: "5"         },
    { label: "One-time Price",    value: "$9.99"     },
  ];

  return (
    <div className="min-h-screen bg-[#050010] text-white">

      {/* Top bar */}
      <div className="mt-16 sticky top-16 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-white transition flex items-center gap-1">
            <Home size={12} /> Home
          </Link>
          <ChevronRight size={12} className="text-gray-700" />
          <span className="text-gray-300">Learning Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <BarChart2 size={12} /> Dashboard
          </Link>
          {!isPro && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setPaymentOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition">
              <Zap size={12} /> Upgrade to Pro
            </motion.button>
          )}
          {isPro && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Star size={12} className="text-yellow-400" /> Pro Member
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">CryptoPulse Learning Hub</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            Master Crypto<br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Technical Analysis</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            From beginner candlesticks to advanced Smart Money Concepts — structured courses
            taught through visual guides and interactive examples.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-6 mt-8">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pro banner (for free users) */}
        {!isPro && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5 rounded-2xl bg-purple-500/5 border border-purple-500/30">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <Lock size={16} className="text-purple-400" /> 5 courses locked
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">Upgrade to Pro for one-time $9.99 — unlock all Intermediate & Advanced content forever.</p>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setPaymentOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition">
              <Zap size={15} /> Unlock Pro — $9.99
            </motion.button>
          </motion.div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-8">
          {["All", "Beginner", "Intermediate", "Advanced"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                filter === f
                  ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
              }`}>{f}</button>
          ))}
          <span className="ml-auto text-xs text-gray-600">{filtered.length} courses</span>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((course, i) => {
            const accessible = canAccess(course);
            const level      = LEVEL_COLORS[course.level];
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => handleCourseClick(course)}
                className={`relative cursor-pointer backdrop-blur-xl bg-white/[0.03] border rounded-2xl p-5 transition group ${
                  accessible
                    ? "border-white/10 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                    : "border-white/5 opacity-80 hover:opacity-100"
                }`}
              >
                {/* Lock overlay for locked courses */}
                {!accessible && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                    <Lock size={14} className="text-gray-500" />
                  </div>
                )}
                {accessible && !course.free && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <Unlock size={14} className="text-purple-400" />
                  </div>
                )}

                {/* Level badge */}
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${level.bg} ${level.border} ${level.text} border`}>
                  {course.level}
                </span>

                <h3 className="font-bold text-sm text-white leading-snug mb-2 pr-8">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{course.subtitle}</p>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.topics.slice(0, 3).map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500">{t}</span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users size={10} /> {course.timeframe}</span>
                </div>

                {/* CTA */}
                <div className={`mt-3 text-xs font-semibold flex items-center gap-1 ${accessible ? "text-purple-400 group-hover:text-purple-300" : "text-gray-600"}`}>
                  {accessible ? (
                    <><BookOpen size={12} /> Start Learning <ChevronRight size={12} /></>
                  ) : (
                    <><Zap size={12} /> Unlock with Pro</>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Free badge */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-700">
            <CheckCircle size={11} className="inline mr-1 text-green-500" />
            Beginner courses are always free for all logged-in users
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        userInfo={userInfo}
      />
    </div>
  );
}
