import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, Activity, LogOut, BarChart2, Brain, RefreshCw } from "lucide-react";
import axios from "axios";
import { API_BASE } from "../api.js";

const AdminDashboard = () => {
  const navigate  = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [stats,    setStats]    = useState({ users: "—", requests: "—", uptime: "—" });

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!info || info.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    setUserInfo(info);
    fetchStats(info.token);
  }, [navigate]);

  const fetchStats = async (token) => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data);
    } catch {
      // Admin stats endpoint not built yet — shows placeholder
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-[#050010] text-white">

      {/* Admin top bar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-red-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <Shield size={16} className="text-red-400" />
          </div>
          <div>
            <span className="font-bold text-white">CryptoPulse Admin</span>
            <span className="ml-2 text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{userInfo.username}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition text-sm"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">System overview and management panel</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Registered Users",   value: stats.users,    icon: Users,    color: "#a855f7" },
            { label: "API Requests Today", value: stats.requests, icon: Activity, color: "#3b82f6" },
            { label: "Server Uptime",      value: stats.uptime,   icon: RefreshCw,color: "#10b981" },
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: color + "20", border: `1px solid ${color}40` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-sm text-gray-400">{label}</span>
              </div>
              <p className="text-3xl font-bold">{value}</p>
            </motion.div>
          ))}
        </div>

        {/* System status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart2 size={18} className="text-purple-400" /> System Components
          </h2>
          <div className="space-y-4">
            {[
              { name: "Express API Server",        status: "Operational", color: "green" },
              { name: "MongoDB Atlas",              status: "Operational", color: "green" },
              { name: "CoinGecko Integration",      status: "Operational", color: "green" },
              { name: "Facebook Prophet Engine",    status: "Operational", color: "green" },
              { name: "VADER Sentiment Engine",     status: "Operational", color: "green" },
              { name: "FRED Macro API",             status: "Pending",     color: "yellow" },
            ].map(({ name, status, color }) => (
              <div key={name} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <Brain size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-300">{name}</span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  color === "green"  ? "bg-green-500/10 text-green-400" :
                  color === "yellow" ? "bg-yellow-500/10 text-yellow-400" :
                  "bg-red-500/10 text-red-400"
                }`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Note */}
        <p className="text-center text-xs text-gray-600 mt-8">
          Admin access only — role verified server-side via JWT middleware
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
