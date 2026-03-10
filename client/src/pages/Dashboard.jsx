import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, RefreshCw,
  Eye, EyeOff, LogOut, Wifi, BarChart2, Activity, Brain,
} from "lucide-react";
import axios from "axios";
import PriceChart    from "../components/dashboard/PriceChart";
import AssetSidebar  from "../components/dashboard/AssetSidebar";
import StatsPanel    from "../components/dashboard/StatsPanel";
import SentimentGauge from "../components/dashboard/SentimentGauge";

export const ASSETS = [
  { id: "bitcoin",     symbol: "BTC", name: "Bitcoin",  icon: "₿", color: "#F7931A" },
  { id: "ethereum",    symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "#627EEA" },
  { id: "solana",      symbol: "SOL", name: "Solana",   icon: "◎", color: "#9945FF" },
  { id: "binancecoin", symbol: "BNB", name: "BNB",      icon: "⬡", color: "#F3BA2F" },
  { id: "ripple",      symbol: "XRP", name: "XRP",      icon: "✕", color: "#346AA9" },
  { id: "cardano",     symbol: "ADA", name: "Cardano",  icon: "₳", color: "#0033AD" },
];

const TIME_PERIODS = [
  { label: "7D",  value: "7"   },
  { label: "30D", value: "30"  },
  { label: "90D", value: "90"  },
  { label: "1Y",  value: "365" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [userInfo,      setUserInfo]      = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [showForecast,  setShowForecast]  = useState(false);
  const [ohlcData,      setOhlcData]      = useState([]);
  const [forecastData,  setForecastData]  = useState(null);   // Prophet output
  const [sentimentData, setSentimentData] = useState(null);   // VADER output
  const [priceStats,    setPriceStats]    = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [error,         setError]         = useState(null);
  const [days,          setDays]          = useState("30");

  // ── Auth guard ─────────────────────────────────────────────────────────
  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!info) { navigate("/login"); return; }
    setUserInfo(info);
  }, [navigate]);

  // ── Fetch OHLC market data ─────────────────────────────────────────────
  const fetchMarketData = useCallback(async () => {
    if (!userInfo) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/market/ohlc/${selectedAsset.id}?days=${days}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setOhlcData(data.ohlc);
      setPriceStats(data.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load market data.");
    } finally {
      setLoading(false);
    }
  }, [userInfo, selectedAsset, days]);

  // ── Fetch Prophet forecast ─────────────────────────────────────────────
  const fetchForecast = useCallback(async () => {
    if (!userInfo || !showForecast) return;
    setForecastLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/forecast/${selectedAsset.id}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setForecastData(data.forecast);
    } catch (err) {
      console.error("Forecast error:", err.message);
      setForecastData(null);
    } finally {
      setForecastLoading(false);
    }
  }, [userInfo, selectedAsset, showForecast]);

  // ── Fetch VADER sentiment ──────────────────────────────────────────────
  const fetchSentiment = useCallback(async () => {
    if (!userInfo) return;
    setSentimentLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/sentiment/${selectedAsset.id}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setSentimentData(data);
    } catch (err) {
      console.error("Sentiment error:", err.message);
    } finally {
      setSentimentLoading(false);
    }
  }, [userInfo, selectedAsset]);

  useEffect(() => { fetchMarketData(); }, [fetchMarketData]);
  useEffect(() => { fetchForecast();   }, [fetchForecast]);
  useEffect(() => { fetchSentiment();  }, [fetchSentiment]);

  // Reset forecast data when toggling off
  useEffect(() => {
    if (!showForecast) setForecastData(null);
    else fetchForecast();
  }, [showForecast]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-[#050010] text-white flex flex-col">

      {/* Top Bar */}
      <div className="mt-16 sticky top-16 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: selectedAsset.color + "33", border: `1px solid ${selectedAsset.color}55` }}>
            <span style={{ color: selectedAsset.color }}>{selectedAsset.icon}</span>
          </div>
          <div>
            <span className="font-bold text-lg">{selectedAsset.name}</span>
            <span className="text-gray-400 ml-2 text-sm">{selectedAsset.symbol}/USD</span>
          </div>
          {priceStats && (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
              <span className="text-xl font-bold">
                ${priceStats.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-lg ${
                priceStats.change24h >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              }`}>
                {priceStats.change24h >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {Math.abs(priceStats.change24h).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <Wifi size={11} /> Live
          </span>
          <button onClick={fetchMarketData} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <span className="hidden md:block text-gray-400 text-sm">{userInfo.username}</span>
          <button onClick={handleLogout} className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition p-2 rounded-lg hover:bg-red-500/10">
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <AssetSidebar assets={ASSETS} selectedAsset={selectedAsset} onAssetChange={(asset) => {
          setSelectedAsset(asset);
          setForecastData(null);
          setSentimentData(null);
        }} />

        <main className="flex-1 overflow-y-auto p-5 space-y-5 min-w-0">

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-white/5 rounded-xl p-1">
              {TIME_PERIODS.map(({ label, value }) => (
                <button key={value} onClick={() => setDays(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    days === value ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]" : "text-gray-400 hover:text-white"
                  }`}>{label}</button>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowForecast(!showForecast)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                showForecast
                  ? "bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-purple-500/50"
              }`}>
              {forecastLoading
                ? <><RefreshCw size={16} className="animate-spin" /> Running Prophet…</>
                : <>{showForecast ? <Eye size={16} /> : <EyeOff size={16} />} {showForecast ? "AI Forecast ON" : "Toggle AI Forecast"}</>
              }
            </motion.button>
          </div>

          {showForecast && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-2.5">
              <Activity size={14} className="shrink-0" />
              <span>
                {forecastLoading
                  ? "Facebook Prophet model running… this takes 10–20 seconds."
                  : forecastData
                    ? `Facebook Prophet forecast loaded — ${forecastData.length} day projection with confidence intervals.`
                    : "Facebook Prophet forecast active — 14-day price projection displayed in purple."
                }
              </span>
            </motion.div>
          )}

          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 100%, ${selectedAsset.color}40, transparent 60%)` }} />
            {error ? (
              <div className="h-105 flex flex-col items-center justify-center gap-3 text-red-400">
                <span className="text-4xl">⚠</span>
                <p className="text-sm">{error}</p>
                <button onClick={fetchMarketData} className="text-xs text-purple-400 hover:underline">Retry</button>
              </div>
            ) : (
              <PriceChart
                data={ohlcData}
                forecastData={forecastData}
                showForecast={showForecast}
                loading={loading}
                assetColor={selectedAsset.color}
              />
            )}
          </motion.div>

          {priceStats && <StatsPanel stats={priceStats} asset={selectedAsset} />}
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 p-4 space-y-4 overflow-y-auto border-l border-white/10 hidden xl:flex xl:flex-col shrink-0">
          <SentimentGauge
            asset={selectedAsset}
            score={sentimentData?.compound ?? 0}
            label={sentimentData?.label}
            postCount={sentimentData?.post_count}
            sources={sentimentData?.sources}
            loading={sentimentLoading}
          />

          {/* Macro placeholder */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <BarChart2 size={15} className="text-purple-400" /> Macro Indicators
            </h3>
            {[["US CPI (YoY)", "FRED API"], ["Fed Funds Rate", "FRED API"], ["Fear & Greed", "Composite"], ["DXY Index", "FRED API"]].map(([label, note]) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-xs text-yellow-500/70 font-medium">{note} ↗</span>
              </div>
            ))}
            <p className="text-xs text-purple-400/50 mt-3 text-center">Integration in progress</p>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
