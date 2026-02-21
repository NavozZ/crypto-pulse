import React from "react";
import Logo from "@/assets/logo.png";

const Navigation = () => {
  return (
    <nav className="w-full bg-linear-to-r from-[#0a001a] to-[#1a0033] border-b border-purple-600">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={Logo}
            alt="Logo"
            className="h-8 w-auto"
          />
          <span className="text-yellow-400 font-bold text-lg">CryptoPulse</span>
        </div>

        {/* Middle - Nav Links */}
        <div className="hidden md:flex space-x-10 text-white font-medium">
          <a href="/" className="hover:text-purple-400 transition">Home</a>
          <a href="/about" className="hover:text-purple-400 transition">About</a>
          <a href="/news" className="hover:text-purple-400 transition">News</a>
        </div>

        {/* Right - Register Button */}
        <div>
          <a
            href="/register"
            className="bg-white text-purple-700 px-5 py-2 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition"
          >
            Register
          </a>
        </div>

      </div>
    </nav>
  );
};

export default Navigation;