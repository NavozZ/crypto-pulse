import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Globe2, TrendingUp } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "6",        label: "Assets Tracked",       suffix: "",   color: "#a855f7" },
  { icon: Cpu,        value: "14",       label: "Day AI Forecast",      suffix: "-",  color: "#3b82f6" },
  { icon: Globe2,     value: "100",      label: "Reddit Posts Scored",  suffix: "+",  color: "#ec4899" },
  { icon: ShieldCheck,value: "BCrypt",   label: "Password Security",    suffix: "",   color: "#10b981" },
];

const StatsBar = () => {
  return (
    <section className="relative bg-[#07050e] border-y border-white/5 py-14 px-6 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.06),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: item.color + "15", border: `1px solid ${item.color}30` }}>
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div className="text-3xl font-black mb-1" style={{ color: item.color }}>
                  {item.value}{item.suffix}
                </div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
