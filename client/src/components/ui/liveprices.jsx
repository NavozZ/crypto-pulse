import React from "react";
import { motion } from "framer-motion";

const priceData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: "$20,788",
    change: "+0.25%",
    isPositive: true,
    icon: "₿",
    color: "#F7931A",
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    price: "$11,657",
    change: "-0.18%",
    isPositive: false,
    icon: "Ł",
    color: "#345D9D",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$21,543",
    change: "+1.56%",
    isPositive: true,
    icon: "Ξ",
    color: "#627EEA",
  },
];

const LivePrices = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#0b0819] to-[#06040f] py-20 px-6 text-white overflow-hidden">
      
      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.15),transparent_40%)]" />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Live <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Market Prices</span>
          </h2>
          <p className="text-gray-400 mt-3 md:mt-0 text-sm max-w-md">
            Real-time crypto insights powered by AI analytics for smarter trading decisions.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {priceData.map((coin, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              whileHover={{ scale: 1.03 }}
              className="relative group"
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/40 to-pink-500/40 blur opacity-0 group-hover:opacity-100 transition" />

              {/* Card */}
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
                
                {/* Top */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg"
                      style={{ backgroundColor: coin.color }}
                    >
                      {coin.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{coin.name}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{coin.symbol}</p>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      coin.isPositive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {coin.change}
                  </span>
                </div>

                {/* Sparkline */}
                <div className="mb-6">
                  <svg viewBox="0 0 100 30" className="w-full h-10">
                    <path
                      d={
                        coin.isPositive
                          ? "M0 20 Q 15 5, 30 20 T 60 10 T 100 15"
                          : "M0 10 Q 15 25, 30 10 T 60 20 T 100 15"
                      }
                      fill="none"
                      stroke={coin.isPositive ? "#4ade80" : "#f87171"}
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Bottom */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Price</p>
                    <p className="text-2xl font-bold">{coin.price}</p>
                  </div>

                  <button className="text-sm text-purple-400 hover:text-purple-300 transition">
                    View →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LivePrices;