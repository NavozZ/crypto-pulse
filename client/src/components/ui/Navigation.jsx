import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BarChart2, LogOut, LayoutDashboard, BookOpen, Star } from "lucide-react";
import logo from "@/assets/Logo.png";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const info = localStorage.getItem("userInfo");
    setUserInfo(info ? JSON.parse(info) : null);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/");
  };

  const isPro = userInfo?.subscription === "pro" || userInfo?.role === "admin";

  const navLinks = userInfo ? [
    { to: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
    { to: "/macro",     label: "Macro",       icon: BarChart2       },
    { to: "/learning",  label: "Learning",    icon: BookOpen        },
    ...(userInfo.role === "admin" ? [{ to: "/admin", label: "Admin", icon: null }] : []),
  ] : [
    { to: "/",         label: "Home"     },
    { to: "/login",    label: "Sign In"  },
    { to: "/register", label: "Register" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "backdrop-blur-xl bg-black/70 border-b border-white/10 shadow-lg" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="CryptoPulse" className="h-8 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 text-sm font-medium transition ${
                location.pathname.startsWith(to) && to !== "/"
                  ? "text-purple-400"
                  : location.pathname === to && to === "/"
                    ? "text-purple-400"
                    : "text-gray-400 hover:text-white"
              }`}>
              {Icon && <Icon size={14} />}
              {label}
              {/* Pro badge on Learning */}
              {label === "Learning" && isPro && (
                <span className="flex items-center gap-0.5 text-xs text-yellow-400 font-semibold">
                  <Star size={9} className="fill-yellow-400" /> Pro
                </span>
              )}
            </Link>
          ))}

          {userInfo ? (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
              <span className="text-xs text-gray-500">{userInfo.username}</span>
              {userInfo.role === "admin" && (
                <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">Admin</span>
              )}
              {isPro && userInfo.role !== "admin" && (
                <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star size={9} className="fill-yellow-400 text-yellow-400" /> Pro
                </span>
              )}
              <button onClick={handleLogout}
                className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition text-sm">
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-[0_0_15px_rgba(168,85,247,0.4)] transition">
                Get Started
              </motion.button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden backdrop-blur-xl bg-black/90 border-b border-white/10 px-6 py-4 flex flex-col gap-4">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-gray-300 hover:text-white text-sm py-1">
                {Icon && <Icon size={14} />} {label}
              </Link>
            ))}
            {userInfo && (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="flex items-center gap-2 text-red-400 text-sm text-left">
                <LogOut size={14} /> Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
