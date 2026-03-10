import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, BarChart2, RefreshCw,
  LogOut, ArrowUpDown, DollarSign, Percent, Activity,
} from "lucide-react";
import axios from "axios";
import {
  createChart, ColorType, LineStyle, LineSeries,
} from "lightweight-charts";

// ── Indicator config ───────────────────────────────────────────────────────
const INDICATORS = [
  {
    id:      "cpi",
    label:   "CPI",
    full:    "Consumer Price Index",
    icon:    BarChart2,
    color:   "#a855f7",
    unit:    "Index",
    desc:    "Measures average change in prices paid by consumers — key inflation gauge",
  },
  {
    id:      "fed_rate",
    label:   "Fed Rate",
    full:    "Federal Funds Rate",
    icon:    Percent,
    color:   "#3b82f6",
    unit:    "%",
    desc:    "Interest rate at which banks lend to each other — drives global liquidity",
  },
  {
    id:      "dxy",
    label:   "DXY",
    full:    "US Dollar Index",
    icon:    DollarSign,
    color:   "#10b981",
    unit:    "Index",
    desc:    "Strength of USD vs basket of currencies — inverse correlation with crypto",
  },
  {
    id:      "unemployment",
    label:   "Unemployment",
    full:    "US Unemployment Rate",
    icon:    Activity,
    color:   "#f59e0b",
    unit:    "%",
    desc:    "Percentage of labour force without work — reflects economic health",
  },
];

// ── Mini Line Chart ────────────────────────────────────────────────────────
const MiniChart = ({ data, color }) => {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current || !data || data.length === 0) return;
    if (chartRef.current) { chartRef.current.remove(); chartRef.current = null; }

    const chart = createChart(ref.current, {
      layout:   { background: { type: ColorType.Solid, color: "transparent" }, textColor: "rgba(255,255,255,0.4)", fontSize: 9 },
      grid:     { vertLines: { visible: false }, horzLines: { color: "rgba(255,255,255,0.04)" } },
      rightPriceScale: { borderVisible: false, textColor: "rgba(255,255,255,0.3)" },
      timeScale:       { borderVisible: false, timeVisible: false },
      crosshair:       { vertLine: { visible: false }, horzLine: { visible: false } },
      width:  ref.current.clientWidth,
      height: 80,
    });
    chartRef.current = chart;

    chart.addSeries(LineSeries, {
      color,
      lineWidth:        2,
      priceLineVisible: false,
      lastValueVisible: false,
    }).setData(data.map(d => ({ time: d.time, value: d.value })));

    chart.timeScale().fitContent();

    const resize = () => chart.applyOptions({ width: ref.current?.clientWidth || 200 });
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("resize", resize); chart.remove(); chartRef.current = null; };
  }, [data, color]);

  return <div ref={ref} className="w-full" />;
};

// ── Full Line Chart ────────────────────────────────────────────────────────
const MacroChart = ({ data, color, label, unit }) => {
  const ref      = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current || !data || data.length === 0) return;
    if (chartRef.current) { chartRef.current.remove(); chartRef.current = null; }

    const chart = createChart(ref.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor:  "rgba(255,255,255,0.5)",
        fontSize:   11,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
      timeScale: {
        borderColor: "rgba(255,255,255,0.08)",
        timeVisible: true,
      },
      crosshair: {
        vertLine: { color: `${color}80`, labelBackgroundColor: color },
        horzLine: { color: `${color}80`, labelBackgroundColor: color },
      },
      width:  ref.current.clientWidth,
      height: 300,
    });
    chartRef.current = chart;

    chart.addSeries(LineSeries, {
      color,
      lineWidth:        2,
      lineStyle:        LineStyle.Solid,
      priceLineVisible: true,
      lastValueVisible: true,
      title:            label,
    }).setData(data.map(d => ({ time: d.time, value: d.value })));

    chart.timeScale().fitContent();

    const resize = () => chart.applyOptions({ width: ref.current?.clientWidth || 400 });
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("resize", resize); chart.remove(); chartRef.current = null; };
  }, [data, color, label]);

  return <div ref={ref} className="w-full" />;
};

// ── MacroPage ──────────────────────────────────────────────────────────────
const MacroPage = () => {
  const navigate  = useNavigate();
  const [userInfo, setUserInfo]   = useState(null);
  const [macroData, setMacroData] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState("cpi");
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!info) { navigate("/login"); return; }
    setUserInfo(info);
  }, [navigate]);

  const fetchMacro = useCallback(async () => {
    if (!userInfo) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("http://localhost:5000/api/macro/indicators", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setMacroData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load macro data");
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => { fetchMacro(); }, [fetchMacro]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const selectedIndicator = INDICATORS.find(i => i.id === selected);
  const selectedData      = macroData?.indicators?.[selected] || [];
  const latest            = macroData?.latest?.[selected];
  const change            = latest ? ((latest.value - latest.prev) / latest.prev) * 100 : null;

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-[#050010] text-white flex flex-col">

      {/* Top bar */}
      <div className="mt-16 sticky top-16 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <BarChart2 size={15} className="text-purple-400" />
          </div>
          <div>
            <span className="font-bold">Macro Dashboard</span>
            <span className="ml-2 text-xs text-gray-500">FRED API — Federal Reserve Economic Data</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchMacro} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => navigate("/dashboard")} className="text-xs text-gray-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-white/5">
            ← Dashboard
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition p-2 rounded-lg">
            <LogOut size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Macroeconomic Indicators</h1>
          <p className="text-gray-400 text-sm mt-1">
            Global economic data from the Federal Reserve — understand how macro conditions correlate with crypto markets
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
            ⚠ {error} — check your FRED_API_KEY in server/.env
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {INDICATORS.map((ind, i) => {
            const lat   = macroData?.latest?.[ind.id];
            const chg   = lat ? ((lat.value - lat.prev) / lat.prev) * 100 : null;
            const pos   = chg >= 0;
            const Icon  = ind.icon;
            const miniD = macroData?.indicators?.[ind.id]?.slice(-20) || [];
            const isActive = selected === ind.id;

            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(ind.id)}
                className={`cursor-pointer backdrop-blur-xl bg-white/[0.03] border rounded-2xl p-4 transition ${
                  isActive ? "border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.2)]" : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: ind.color + "20", border: `1px solid ${ind.color}40` }}>
                      <Icon size={14} style={{ color: ind.color }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-300">{ind.label}</span>
                  </div>
                  {chg !== null && (
                    <span className={`text-xs flex items-center gap-0.5 ${pos ? "text-green-400" : "text-red-400"}`}>
                      {pos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {Math.abs(chg).toFixed(2)}%
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="w-20 h-6 bg-white/10 rounded animate-pulse mb-2" />
                ) : (
                  <p className="text-xl font-bold mb-1">
                    {lat?.value?.toFixed(2) ?? "—"} <span className="text-xs text-gray-500">{ind.unit}</span>
                  </p>
                )}

                <p className="text-xs text-gray-600 mb-3">{ind.full}</p>

                {/* Mini sparkline */}
                {!loading && miniD.length > 0 && (
                  <MiniChart data={miniD} color={ind.color} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Selected indicator full chart */}
        {selectedIndicator && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span style={{ color: selectedIndicator.color }}>●</span>
                  {selectedIndicator.full}
                </h2>
                <p className="text-xs text-gray-500 mt-1">{selectedIndicator.desc}</p>
              </div>
              {latest && (
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Latest Value</p>
                    <p className="text-2xl font-bold" style={{ color: selectedIndicator.color }}>
                      {latest.value?.toFixed(2)} <span className="text-sm text-gray-500">{selectedIndicator.unit}</span>
                    </p>
                  </div>
                  {change !== null && (
                    <div className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1 ${
                      change >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                    </div>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : selectedData.length > 0 ? (
              <MacroChart
                data={selectedData}
                color={selectedIndicator.color}
                label={selectedIndicator.label}
                unit={selectedIndicator.unit}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
                No data available
              </div>
            )}
          </motion.div>
        )}

        {/* Crypto correlation note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <ArrowUpDown size={14} className="text-purple-400" />
            Crypto–Macro Correlation Guide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { ind: "CPI ↑",          effect: "Bearish for crypto",  note: "High inflation → Fed raises rates → liquidity drops",  color: "red"    },
              { ind: "Fed Rate ↑",     effect: "Bearish for crypto",  note: "Higher rates → risk-off → capital flows from crypto",   color: "red"    },
              { ind: "DXY ↑",          effect: "Bearish for crypto",  note: "Strong USD → crypto priced lower in USD terms",         color: "red"    },
              { ind: "Unemployment ↑", effect: "Mixed signal",        note: "May trigger Fed rate cuts → potentially bullish",       color: "yellow" },
            ].map(({ ind, effect, note, color }) => (
              <div key={ind} className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                <p className="text-sm font-semibold text-white mb-1">{ind}</p>
                <p className={`text-xs font-semibold mb-2 ${color === "red" ? "text-red-400" : "text-yellow-400"}`}>
                  {effect}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-700 pb-4">
          Data sourced from FRED (Federal Reserve Bank of St. Louis) · Updated hourly · FR7 compliance
        </p>
      </div>
    </div>
  );
};

export default MacroPage;
