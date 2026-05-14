/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, RefreshCw, Eye, EyeOff,
  LogOut, Wifi, BarChart2, Activity, Brain, Home,
  ChevronRight, LineChart, Target, Info,
} from "lucide-react";
import axios from "axios";
import PriceChart         from "../components/dashboard/PriceChart";
import AssetSidebar       from "../components/dashboard/AssetSidebar";
import StatsPanel         from "../components/dashboard/StatsPanel";
import SentimentGauge     from "../components/dashboard/SentimentGauge";
import TechnicalIndicators from "../components/dashboard/TechnicalIndicators";
import ForecastAccuracy   from "../components/dashboard/ForecastAccuracy";
import { API_BASE } from "../api.js";
import { COINS } from "../constants/coins";

const TIME_PERIODS = [
  { label: "7D",  value: "7"   },
  { label: "30D", value: "30"  },
  { label: "90D", value: "90"  },
  { label: "1Y",  value: "365" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo,         setUserInfo]         = useState(null);
  const [selectedAsset,    setSelectedAsset]    = useState(COINS[0]);
  const [showForecast,     setShowForecast]     = useState(false);
  const [showMA,           setShowMA]           = useState(true);
  const [showAccuracy,     setShowAccuracy]     = useState(false);
  const [ohlcData,         setOhlcData]         = useState([]);
  const [forecastData,     setForecastData]     = useState(null);
  const [sentimentData,    setSentimentData]    = useState(null);
  const [priceStats,       setPriceStats]       = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [forecastLoading,  setForecastLoading]  = useState(false);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [error,            setError]            = useState(null);
  const [days,             setDays]             = useState("30");

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!info) { navigate("/login"); return; }
    setUserInfo(info);
  }, [navigate]);

  const fetchMarketData = useCallback(async () => {
    if (!userInfo) return;
    setLoading(true); setError(null);
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/market/ohlc/${selectedAsset.id}?days=${days}`
      );
      setOhlcData(data.ohlc);
      setPriceStats(data.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load market data.");
    } finally { setLoading(false); }
  }, [userInfo, selectedAsset, days]);

  const fetchForecast = useCallback(async () => {
    if (!userInfo || !showForecast) return;
    setForecastLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/forecast/${selectedAsset.id}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setForecastData(data.forecast);
    } catch { setForecastData(null); }
    finally { setForecastLoading(false); }
  }, [userInfo, selectedAsset, showForecast]);

  const fetchSentiment = useCallback(async () => {
    if (!userInfo) return;
    setSentimentLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/sentiment/${selectedAsset.id}`
      );
      setSentimentData(data);
    } catch { /* silent */ }
    finally { setSentimentLoading(false); }
  }, [userInfo, selectedAsset]);

  useEffect(() => { fetchMarketData(); }, [fetchMarketData]);
  useEffect(() => { if (showForecast) fetchForecast(); else setForecastData(null); }, [showForecast, fetchForecast]);
  useEffect(() => { fetchSentiment(); }, [fetchSentiment]);

  const handleAssetChange = (asset) => {
    setSelectedAsset(asset);
    setForecastData(null);
    setSentimentData(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-[#050010] text-white flex flex-col">

      {/* ── Top Navigation Bar ───────────────────────────────────── */}
      <div className="mt-16 sticky top-16 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">

          {/* Left: breadcrumb + asset */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
              <Link to="/" className="hover:text-white transition flex items-center gap-1">
                <Home size={11} /> Home
              </Link>
              <ChevronRight size={11} />
              <span className="text-gray-300">Dashboard</span>
            </div>

            {/* Divider */}
            <span className="hidden sm:block text-gray-700 mx-1">|</span>

            {/* Asset info */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: selectedAsset.color + "30", border: `1px solid ${selectedAsset.color}50` }}>
                <span style={{ color: selectedAsset.color }}>{selectedAsset.icon}</span>
              </div>
              <span className="font-semibold text-sm">{selectedAsset.name}</span>
              <span className="text-gray-500 text-xs">{selectedAsset.symbol}/USD</span>
              {priceStats && (
                <div className="flex items-center gap-2 ml-1 pl-2 border-l border-white/10">
                  <span className="text-sm font-bold">
                    ${priceStats.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`text-xs font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                    priceStats.change24h >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {priceStats.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {Math.abs(priceStats.change24h).toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:flex items-center gap-1 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <Wifi size={10} /> Live
            </span>

            {/* Macro link */}
            <Link to="/macro"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-400 transition px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/30">
              <BarChart2 size={12} /> Macro
            </Link>

            <button onClick={fetchMarketData}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white">
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>

            <span className="hidden md:block text-xs text-gray-500">{userInfo.username}</span>

            <button onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition px-2 py-1.5 rounded-lg hover:bg-red-500/10">
              <LogOut size={13} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Asset Sidebar */}
        <AssetSidebar assets={COINS} selectedAsset={selectedAsset} onAssetChange={handleAssetChange} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 min-w-0">

          {/* Chart controls */}
          <div className="flex flex-wrap items-center justify-between gap-2">

            {/* Time period selector */}
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
              {TIME_PERIODS.map(({ label, value }) => (
                <button key={value} onClick={() => setDays(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    days === value
                      ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                      : "text-gray-400 hover:text-white"
                  }`}>{label}</button>
              ))}
            </div>

            {/* Toggle buttons */}
            <div className="flex items-center gap-2">

              {/* MA Toggle */}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => setShowMA(!showMA)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showMA
                    ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400"
                    : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"
                }`}>
                <LineChart size={13} /> MA Lines
              </motion.button>

              {/* Forecast Toggle */}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => setShowForecast(!showForecast)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showForecast
                    ? "bg-purple-600/20 border-purple-500/50 text-purple-300"
                    : "bg-white/5 border-white/10 text-gray-500 hover:border-purple-500/30"
                }`}>
                {forecastLoading
                  ? <RefreshCw size={13} className="animate-spin" />
                  : showForecast ? <Eye size={13} /> : <EyeOff size={13} />
                }
                AI Forecast
              </motion.button>

              {/* Accuracy badge toggle */}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => setShowAccuracy(!showAccuracy)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-white/5 border-white/10 text-gray-500 hover:border-white/20 transition">
                <Target size={13} /> Accuracy
              </motion.button>
            </div>
          </div>

          {/* Accuracy info banner */}
          <AnimatePresence>
            {showAccuracy && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-4 px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <Info size={12} /> <span className="font-semibold">Prophet Model Evaluation (BTC 30-day backtest)</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <span>MAE: <strong className="text-white">$12,284</strong></span>
                    <span>RMSE: <strong className="text-white">$14,648</strong></span>
                    <span>MAPE: <strong className="text-green-400">17.88%</strong></span>
                    <span className="text-gray-600">— Acceptable for crypto (PID §5.4)</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forecast info banner */}
          <AnimatePresence>
            {showForecast && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/8 border border-purple-500/20 rounded-xl px-4 py-2.5"
              >
                <Activity size={12} className="shrink-0" />
                {forecastLoading
                  ? "Facebook Prophet model running… 10–20 seconds"
                  : forecastData
                    ? `Prophet 14-day forecast loaded — ${forecastData.length} day projection with 80% confidence intervals`
                    : "Loading forecast…"
                }
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-4 overflow-hidden"
          >
            <div className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 100%, ${selectedAsset.color}40, transparent 60%)` }} />
            {error ? (
              <div className="h-105 flex flex-col items-center justify-center gap-3 text-red-400">
                <span className="text-4xl">⚠</span>
                <p className="text-sm">{error}</p>
                <button onClick={fetchMarketData} className="text-xs text-purple-400 hover:underline mt-1">Retry</button>
              </div>
            ) : (
              <PriceChart
                data={ohlcData}
                forecastData={forecastData}
                showForecast={showForecast}
                showMA={showMA}
                loading={loading}
                assetColor={selectedAsset.color}
              />
            )}
          </motion.div>

          {/* Stats Panel */}
          {priceStats && <StatsPanel stats={priceStats} asset={selectedAsset} />}

          {/* Forecast Accuracy Section */}
          <AnimatePresence>
            {showAccuracy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-6 overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl opacity-5 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 50%, #3b82f650, transparent 60%)` }} />
                <div className="relative">
                  <ForecastAccuracy selectedAsset={selectedAsset} userInfo={userInfo} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link to="/macro"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/3 border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 transition text-sm text-gray-400 hover:text-white">
              <BarChart2 size={14} className="text-purple-400" />
              Macro Dashboard
              <ChevronRight size={12} className="text-gray-600" />
            </Link>
            <Link to="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/3 border border-white/10 hover:border-white/20 transition text-sm text-gray-400 hover:text-white">
              <Home size={14} />
              Back to Home
              <ChevronRight size={12} className="text-gray-600" />
            </Link>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 p-3 space-y-3 overflow-y-auto border-l border-white/10 hidden xl:flex xl:flex-col shrink-0">

          {/* Technical Analysis */}
          <TechnicalIndicators ohlcData={ohlcData} asset={selectedAsset} />

          {/* Sentiment Gauge */}
          <SentimentGauge
            asset={selectedAsset}
            score={sentimentData?.compound ?? 0}
            label={sentimentData?.label}
            postCount={sentimentData?.post_count}
            sources={sentimentData?.sources}
            loading={sentimentLoading}
          />

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-4"
          >
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Access
            </h3>
            <div className="space-y-1.5">
              {[
                { to: "/macro",     icon: BarChart2, label: "Macro Dashboard",   note: "CPI · Fed Rate · DXY" },
                { to: "/forecast-history", icon: Target, label: "Forecast History", note: "Prediction outcomes" },
                { to: "/ai-explanation", icon: Brain, label: "AI Explanation", note: "Signal reasoning" },
                { to: "/",          icon: Home,      label: "Landing Page",       note: "Back to home"         },
              ].map(({ to, icon: Icon, label, note }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition">
                    <Icon size={14} className="text-gray-400 group-hover:text-purple-400 transition" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-300 group-hover:text-white transition">{label}</p>
                    <p className="text-xs text-gray-600">{note}</p>
                  </div>
                  <ChevronRight size={12} className="text-gray-700 ml-auto group-hover:text-gray-400 transition" />
                </Link>
              ))}
            </div>
          </motion.div>

        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
