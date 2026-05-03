import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../api";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/register`, formData);

      // Store user info (includes role) in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);

      // New users are always role: "user" → go straight to dashboard
      navigate("/dashboard");

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0a001a] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-purple-500/30 p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">Join CryptoPulse for AI-powered insights</p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-purple-400" size={18} />
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-purple-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-purple-400" size={18} />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              required
              minLength={6}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">Login here</Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Register;
