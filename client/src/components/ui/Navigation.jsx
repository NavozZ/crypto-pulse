import React, { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/Logo.png";

const Navigation = () => {
  const [open, setOpen]         = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate                = useNavigate();

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo") || "null");
    setUserInfo(info);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/");
    setOpen(false);
  };

  const navLinks = [
    { name: "Home",  href: "/" },
    { name: "About", href: "/about" },
    { name: "News",  href: "/news" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">

      {/* Gradient top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-purple-500 via-pink-500 to-blue-500" />

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="CryptoPulse Logo" className="h-9 w-auto" />
          <span className="text-white font-bold text-lg tracking-wide">
            Crypto<span className="text-purple-400">Pulse</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="relative text-gray-300 font-medium transition group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Right CTA — changes based on auth state */}
        <div className="hidden md:flex items-center gap-3">
          {userInfo ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/5 border border-white/10 hover:bg-purple-600/20 hover:border-purple-500/50 transition"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="relative inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-purple-500 to-pink-500 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-[#0b0819] backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-lg">Menu</span>
            <button onClick={() => setOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setOpen(false)}
              className="text-gray-300 text-lg hover:text-purple-400 transition"
            >
              {link.name}
            </Link>
          ))}

          {userInfo ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-purple-400 text-lg hover:text-purple-300 transition"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-400 text-lg text-left hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-purple-500 to-pink-500 shadow-lg"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
