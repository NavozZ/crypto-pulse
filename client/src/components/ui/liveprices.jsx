import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import axios from "axios";
import { API_BASE } from "../../api";

const COINS = [
  { id: "bitcoin",  symbol: "BTC", name: "Bitcoin",  icon: "₿", color: "#F7931A" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "#627EEA" },
  { id: "solana",   symbol: "SOL", name: "Solana",   icon: "◎", color: "#9945FF" },
  { id: "binancecoin", symbol: "BNB", name: "BNB",   icon: "⬡", color: "#F3BA2F" },
  { id: "ripple",   symbol: "XRP", name: "XRP",      icon: "✕", color: "#346AA9" },
  { id: "cardano",  symbol: "ADA", name: "Cardano",  icon: "₳", color: "#0033AD" },
];

const formatPrice = (price) => {
  if (!price) return "—";
  if (price >= 1000) return "$" + price.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (price >= 1)    return "$" + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return "$" + price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
};

const formatCap = (cap) => {
  if (!cap) return "—";
  if (cap >= 1e12) return "$" + (cap / 1e12).toFixed(2) + "T";
  if (cap >= 1e9)  return "$" + (cap / 1e9).toFixed(1)  + "B";
  return "$" + (cap / 1e6).toFixed(0) + "M";
};

const LivePrices = () => {
  const [prices, setPrices]   = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPrices = async () => {
    try {
      setError(null);
      const priceData = {};

      const fetchPromises = COINS.map((coin) =>
        axios
          .get(`${API_BASE}/api/market/data?coin=${coin.id}`)
          .then((res) => {
            priceData[coin.id] = {
              usd: res.data.price,
              usd_24h_change: res.data.change_24h,
              usd_market_cap: res.data.volume,
              source: res.data.source,
              cached: res.data.cached,
            };
          })
          .catch((err) => {
            console.warn(`Failed to fetch ${coin.id}:`, err.message);
            priceData[coin.id] = null;
          })
      );

      await Promise.all(fetchPromises);
      setPrices(priceData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching prices:", err.message);
      setError("Unable to fetch market prices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-linear-to-b from-[#0b0819] to-[#06040f] py-20 px-6 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.15),transparent_40%)]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Live <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Market Prices</span>
            </h2>
            <p className="text-gray-400 mt-2 text-sm">Powered by CryptoPulse Backend — updated every 30 seconds</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchPrices}
              disabled={loading}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-gray-400 hover:text-white disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COINS.map((coin, index) => {
            const data     = prices[coin.id];
            const price    = data?.usd;
            const change   = data?.usd_24h_change ?? 0;
            const cap      = data?.usd_market_cap;
            const positive = change >= 0;

            return (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative group cursor-default"
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/30 to-pink-500/30 blur opacity-0 group-hover:opacity-100 transition duration-300" />

                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg"
                        style={{ backgroundColor: coin.color + "33", border: `1px solid ${coin.color}66` }}>
                        <span style={{ color: coin.color }}>{coin.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{coin.name}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{coin.symbol}/USD</p>
                      </div>
                    </div>

                    {loading || !data ? (
                      <div className="w-16 h-6 bg-white/10 rounded-full animate-pulse" />
                    ) : (
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        positive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {positive ? "+" : ""}{change?.toFixed(2)}%
                      </span>
                    )}
                  </div>

                  {/* Sparkline (animated) */}
                  <div className="mb-5">
                    <svg viewBox="0 0 100 30" className="w-full h-8">
                      <path
                        d={positive
                          ? "M0 25 Q 20 15, 40 18 T 70 8 T 100 12"
                          : "M0 10 Q 20 18, 40 14 T 70 22 T 100 18"}
                        fill="none"
                        stroke={positive ? "#4ade80" : "#f87171"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                    </svg>
                  </div>

                  {/* Price + Volume */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Current Price</p>
                      {loading || !data ? (
                        <div className="w-28 h-7 bg-white/10 rounded animate-pulse" />
                      ) : (
                        <p className="text-2xl font-bold">{formatPrice(price)}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0.5">24h Volume</p>
                      {loading || !data ? (
                        <div className="w-16 h-4 bg-white/10 rounded animate-pulse" />
                      ) : (
                        <p className="text-sm font-semibold text-gray-300">{formatCap(cap)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LivePrices;
