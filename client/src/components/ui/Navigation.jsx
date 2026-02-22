import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/assets/logo.png";

const Navigation = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "News", href: "/news" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      
      {/* Gradient Glow Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="h-9 w-auto" />
          <span className="text-white font-bold text-lg tracking-wide">
            Crypto<span className="text-purple-400">Pulse</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="relative text-gray-300 font-medium transition group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-purple-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Right CTA */}
        <div className="hidden md:block">
          <a
            href="/register"
            className="relative inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg 
            hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-[#0b0819] backdrop-blur-xl border-l border-white/10 
        transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-lg">Menu</span>
            <button onClick={() => setOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>

          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-gray-300 text-lg hover:text-purple-400 transition"
            >
              {link.name}
            </a>
          ))}

          <a
            href="/register"
            className="mt-4 inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;