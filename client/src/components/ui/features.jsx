import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  BrainCircuit,
  LayoutDashboard,
  Columns2,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const featureData = [
  {
    title: "AI-Powered Price Forecasting",
    description:
      "Advanced machine learning models predict market movements using historical data and real-time indicators.",
    icon: LineChart,
  },
  {
    title: "Real-Time Sentiment Analysis",
    description:
      "AI analyzes social media, news, and on-chain data to measure market psychology in real time.",
    icon: BrainCircuit,
  },
  {
    title: "Macroeconomic Correlation Dashboard",
    description:
      "Track global economic indicators and their influence on crypto markets with AI correlation mapping.",
    icon: LayoutDashboard,
  },
  {
    title: "Unified Comparison Tool",
    description:
      "Compare multiple assets across technical, fundamental, and sentiment metrics in one interface.",
    icon: Columns2,
  },
  {
    title: "Professional-Grade Visualization",
    description:
      "Institutional-level charts and dashboards for serious traders and analysts.",
    icon: BarChart3,
  },
  {
    title: "Secure & High-Performance Architecture",
    description:
      "Built with enterprise security standards, scalable infrastructure, and low-latency performance.",
    icon: ShieldCheck,
  },
];

const Features = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#0b0819] to-[#06040f] py-28 px-6 text-white overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.15),transparent_40%)]" />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Platform <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-gray-400 mt-4">
            CryptoPulse delivers enterprise-grade AI tools designed to transform
            crypto trading into a data-driven, intelligent investment process.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {featureData.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Gradient Glow Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/40 to-pink-500/40 blur opacity-0 group-hover:opacity-100 transition" />

                {/* Card */}
                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 h-full shadow-xl">

                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition">
                    <Icon className="w-7 h-7 text-purple-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;