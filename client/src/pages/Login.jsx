import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in:", formData);
    // Integration with Backend API (/api/auth/login) goes here
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0a001a] px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-purple-500/30 p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-purple-400" size={20} />
            <input 
              type="email" placeholder="Email Address"
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
            <input 
              type="password" placeholder="Password"
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition">
            Sign In
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6 text-sm">
          Don't have an account? <a href="/register" className="text-purple-400 hover:underline">Register now</a>
        </p>
      </motion.div>
    </section>
  );
};

export default Login;