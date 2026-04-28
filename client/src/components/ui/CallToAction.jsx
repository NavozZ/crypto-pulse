import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="relative bg-linear-to-b from-[#06040f] to-[#0a001a] py-28 px-6 text-white overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-75 h-75 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <BrainCircuit size={32} className="text-purple-400" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Stop Guessing.{" "}
            <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Start Analysing.
            </span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Join CryptoPulse and get access to AI-powered forecasting, real-time sentiment analysis,
            and macroeconomic insights — all in one unified dashboard built for retail investors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-[0_0_30px_rgba(168,85,247,0.5)] transition"
              >
                Get Started Free <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/20 hover:border-purple-500/50 text-white font-semibold transition"
              >
                Sign In →
              </motion.button>
            </Link>
          </div>

          <p className="text-xs text-gray-600 mt-6">
            Free to use · No credit card required · Academic FYP project
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
