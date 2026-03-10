import React from "react";
import { motion } from "framer-motion";
import { UserPlus, BarChart2, BrainCircuit, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description: "Register securely in seconds. Your credentials are protected with BCrypt hashing and JWT authentication.",
    color: "#a855f7",
  },
  {
    step: "02",
    icon: BarChart2,
    title: "Select Your Asset",
    description: "Choose from Bitcoin, Ethereum, Solana, BNB, XRP or Cardano. Live OHLC candlestick data loads instantly.",
    color: "#3b82f6",
  },
  {
    step: "03",
    icon: BrainCircuit,
    title: "Activate AI Forecast",
    description: "Toggle the Facebook Prophet engine to overlay a 14-day price forecast with confidence intervals onto your chart.",
    color: "#ec4899",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Read Market Sentiment",
    description: "The VADER engine scores hundreds of Reddit posts in real time, giving you an objective market mood score.",
    color: "#10b981",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative bg-linear-to-b from-[#06040f] to-[#0a001a] py-28 px-6 text-white overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-purple-400 uppercase mb-4 block">
            Simple by Design
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            How <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">It Works</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            From sign-up to AI-powered insight in four simple steps. No financial expertise required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-1rem)] w-8 h-px bg-linear-to-r from-white/20 to-transparent z-10" />
                )}

                <div className="backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-7 h-full hover:border-white/20 transition group-hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                  {/* Step number */}
                  <div className="text-5xl font-black mb-4 opacity-10 leading-none"
                    style={{ color: item.color }}>{item.step}</div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: item.color + "20", border: `1px solid ${item.color}40` }}>
                    <Icon size={22} style={{ color: item.color }} />
                  </div>

                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
