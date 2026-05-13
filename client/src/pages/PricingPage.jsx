import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    features: ["Market dashboard", "Basic sentiment feed", "Limited forecast usage", "Community learning content"],
  },
  {
    name: "Premium",
    monthly: 19,
    yearly: 190,
    recommended: true,
    features: ["Advanced AI forecasts", "Forecast history analytics", "AI explanation engine", "Watchlist with live pricing", "Premium learning modules", "Priority support"],
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");

  return (
    <div className="min-h-screen bg-[#050010] text-white px-4 py-24 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-purple-300">Pricing</p>
          <h1 className="text-4xl font-black mt-2">Transparent SaaS Pricing</h1>
          <p className="text-gray-400 mt-3">Choose the right plan for your crypto trading intelligence workflow.</p>
          <div className="mt-5 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 text-sm rounded-lg ${billing === "monthly" ? "bg-purple-600" : "text-gray-400"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-1.5 text-sm rounded-lg ${billing === "yearly" ? "bg-purple-600" : "text-gray-400"}`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-3xl border p-6 backdrop-blur-xl transition hover:-translate-y-1 ${plan.recommended ? "border-purple-500/60 bg-purple-500/10 shadow-[0_0_45px_rgba(168,85,247,0.3)]" : "border-white/10 bg-white/[0.03]"}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                {plan.recommended && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border border-purple-400/40 bg-purple-400/20 text-purple-200">
                    <Sparkles size={12} /> Recommended
                  </span>
                )}
              </div>
              <p className="mt-4 text-4xl font-black">
                ${billing === "monthly" ? plan.monthly : plan.yearly}
                <span className="text-sm text-gray-400"> /{billing === "monthly" ? "month" : "year"}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {billing === "monthly" ? `or $${plan.yearly}/year` : `equivalent $${plan.monthly}/month`}
              </p>
              <div className="mt-5 space-y-2">
                {plan.features.map((feature) => (
                  <p key={feature} className="text-sm text-gray-300 flex items-center gap-2">
                    <Check size={14} className="text-green-400" /> {feature}
                  </p>
                ))}
              </div>
              <Link to={plan.name === "Premium" ? "/learning" : "/register"}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold ${plan.recommended ? "bg-purple-600 hover:bg-purple-500" : "bg-white/10 hover:bg-white/20"}`}>
                {plan.name === "Premium" ? "Upgrade to Premium" : "Start Free"}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 overflow-x-auto">
          <h3 className="text-xl font-bold mb-4">Feature Comparison</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/10">
                <th className="py-2">Feature</th><th>Free</th><th>Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["AI Forecast Explanation", "—", "Yes"],
                ["Forecast History Analytics", "Basic", "Advanced"],
                ["Watchlist & Alerts", "Basic", "Advanced"],
                ["Sentiment Intelligence", "Basic", "Deep analysis"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-white/5">
                  <td className="py-3">{row[0]}</td><td className="text-gray-400">{row[1]}</td><td className="text-purple-300">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-xl font-bold">FAQ</h3>
          <div className="mt-3 space-y-3 text-sm text-gray-300">
            <p><strong>Can I cancel anytime?</strong> Yes, your plan can be changed at any time from your profile.</p>
            <p><strong>Do you provide investment advice?</strong> No, CryptoPulse provides analytics and forecasting support only.</p>
            <p><strong>Which assets are supported?</strong> BTC, ETH, SOL, BNB, XRP, and ADA with expanding coverage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

