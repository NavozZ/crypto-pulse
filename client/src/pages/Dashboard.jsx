import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, RefreshCw,
  Eye, EyeOff, LogOut, Wifi, BarChart2, Activity,
} from "lucide-react";
import axios from "axios";
import PriceChart from "../components/dashboard/PriceChart";
import AssetSidebar from "../components/dashboard/AssetSidebar";
import StatsPanel from "../components/dashboard/StatsPanel";
import SentimentGauge from "../components/dashboard/SentimentGauge";

//  Asset Registry 
export const ASSETS = [
  { id: "bitcoin",      symbol: "BTC", name: "Bitcoin",  icon: "₿", color: "#F7931A" },
  { id: "ethereum",     symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "#627EEA" },
  { id: "solana",       symbol: "SOL", name: "Solana",   icon: "◎", color: "#9945FF" },
  { id: "binancecoin",  symbol: "BNB", name: "BNB",      icon: "⬡", color: "#F3BA2F" },
  { id: "ripple",       symbol: "XRP", name: "XRP",      icon: "✕", color: "#346AA9" },
  { id: "cardano",      symbol: "ADA", name: "Cardano",  icon: "₳", color: "#0033AD" },
];

const TIME_PERIODS = [
  { label: "7D",  value: "7" },
  { label: "30D", value: "30" },
  { label: "90D", value: "90" },
  { label: "1Y",  value: "365" },
];

//Dashboard Component 
const Dashboard = () => {
  const navigate = useNavigate();

  // State
  const [userInfo, setUserInfo]         = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [showForecast, setShowForecast] = useState(false);
  const [ohlcData, setOhlcData]         = useState([]);
  const [priceStats, setPriceStats]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [days, setDays]                 = useState("30");

  // Protected Route 
  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!info) {
      navigate("/login");
      return;
    }
    setUserInfo(info);
  }, [navigate]);

  // Fetch Market Data 
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
      const msg = err.response?.data?.message || "Failed to load market data. Check your connection.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [userInfo, selectedAsset, days]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Handlers 
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (!userInfo) return null;

  // Render 
  return (
    <div className="min-h-screen bg-[#050010] text-white flex flex-col">

      {/*  Dashboard Top Bar  */}
      <div className="mt-16 sticky top-16 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10 px-6 py-3 flex items-center justify-between gap-4">

        {/* Asset Info */}
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shrink-0"
            style={{ backgroundColor: selectedAsset.color + "33", border: `1px solid ${selectedAsset.color}55` }}
          >
            <span style={{ color: selectedAsset.color }}>{selectedAsset.icon}</span>
          </div>
          <div>
            <span className="font-bold text-lg leading-none">{selectedAsset.name}</span>
            <span className="text-gray-400 ml-2 text-sm">{selectedAsset.symbol}/USD</span>
          </div>

          {priceStats && (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
              <span className="text-xl font-bold tracking-tight">
                ${priceStats.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-lg ${
                priceStats.change24h >= 0
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}>
                {priceStats.change24h >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {Math.abs(priceStats.change24h).toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <Wifi size={11} /> Live
          </span>
          <button
            onClick={fetchMarketData}
            title="Refresh data"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <span className="hidden md:block text-gray-400 text-sm">
            {userInfo.username}
          </span>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition p-2 rounded-lg hover:bg-red-500/10"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/*  Main Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Asset Sidebar */}
        <AssetSidebar
          assets={ASSETS}
          selectedAsset={selectedAsset}
          onAssetChange={setSelectedAsset}
        />

        {/* Main Content  */}
        <main className="flex-1 overflow-y-auto p-5 space-y-5 min-w-0">

          {/* Chart Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">

            {/* Time Period Selector */}
            <div className="flex items-center gap-1.5 bg-white/5 rounded-xl p-1">
              {TIME_PERIODS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setDays(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    days === value
                      ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* AI Forecast Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForecast(!showForecast)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                showForecast
                  ? "bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-purple-500/50 hover:text-white"
              }`}
            >
              {showForecast ? <Eye size={16} /> : <EyeOff size={16} />}
              {showForecast ? "AI Forecast ON" : "Toggle AI Forecast"}
            </motion.button>
          </div>

          {/* Forecast Active Banner */}
          {showForecast && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-2.5"
            >
              <Activity size={14} className="shrink-0" />
              <span>
                <strong>Facebook Prophet</strong> forecast active — 14-day price projection with upper/lower confidence intervals displayed in purple.
              </span>
            </motion.div>
          )}

          {/* Price Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden"
          >
            {/* Subtle glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 100%, ${selectedAsset.color}40, transparent 60%)`,
              }}
            />

            {error ? (
              <div className="h-105 flex flex-col items-center justify-center gap-3 text-red-400">
                <span className="text-4xl">⚠</span>
                <p className="text-sm">{error}</p>
                <button
                  onClick={fetchMarketData}
                  className="text-xs text-purple-400 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <PriceChart
                data={ohlcData}
                showForecast={showForecast}
                loading={loading}
                assetColor={selectedAsset.color}
              />
            )}
          </motion.div>

          {/* Stats Panel */}
          {priceStats && (
            <StatsPanel stats={priceStats} asset={selectedAsset} />
          )}
        </main>

        {/*  Right Sidebar  */}
        <aside className="w-72 p-4 space-y-4 overflow-y-auto border-l border-white/10 hidden xl:flex xl:flex-col shrink-0">

          {/* VADER Sentiment Gauge */}
          <SentimentGauge asset={selectedAsset} />

          {/* Macro Indicators Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-4"
          >
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <BarChart2 size={15} className="text-purple-400" />
              Macro Indicators
            </h3>
            <div className="space-y-0">
              {[
                { label: "US CPI (YoY)", note: "FRED API" },
                { label: "Fed Funds Rate", note: "FRED API" },
                { label: "Fear & Greed", note: "Composite" },
                { label: "DXY Index",    note: "FRED API" },
              ].map(({ label, note }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                >
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs text-yellow-500/70 font-medium">{note} ↗</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-purple-400/50 mt-3 text-center">
              Integration in progress
            </p>
          </motion.div>

          {/* Watchlist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-4 flex-1"
          >
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              Quick Switch
            </h3>
            <div className="space-y-2">
              {ASSETS.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left ${
                    selectedAsset.id === asset.id
                      ? "bg-purple-600/20 border border-purple-500/40"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: asset.color + "33", color: asset.color }}
                  >
                    {asset.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">{asset.symbol}</p>
                    <p className="text-xs text-gray-500 truncate">{asset.name}</p>
                  </div>
                  {selectedAsset.id === asset.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
