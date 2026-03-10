import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";

// ── PriceChart Component ───────────────────────────────────────────────────
// forecastData: real Prophet output from /api/forecast/:coinId
//               [{time, yhat, yhat_lower, yhat_upper}]
//               Falls back to mock if null (while loading)
const PriceChart = ({ data, forecastData, showForecast, loading, assetColor }) => {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!data || data.length === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // ── Chart init ───────────────────────────────────────────────────
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor:  "rgba(255, 255, 255, 0.6)",
        fontSize:   11,
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.04)" },
        horzLines: { color: "rgba(255, 255, 255, 0.04)" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "rgba(168, 85, 247, 0.5)", labelBackgroundColor: "#7e22ce" },
        horzLine: { color: "rgba(168, 85, 247, 0.5)", labelBackgroundColor: "#7e22ce" },
      },
      rightPriceScale: { borderColor: "rgba(255, 255, 255, 0.08)" },
      timeScale: {
        borderColor:    "rgba(255, 255, 255, 0.08)",
        timeVisible:    true,
        secondsVisible: false,
      },
      width:  containerRef.current.clientWidth,
      height: 420,
    });

    chartRef.current = chart;

    // ── Candlestick series (v5 API) ──────────────────────────────────
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor:         "#4ade80",
      downColor:       "#f87171",
      borderUpColor:   "#4ade80",
      borderDownColor: "#f87171",
      wickUpColor:     "#4ade80",
      wickDownColor:   "#f87171",
    });
    candleSeries.setData(data);

    // ── Prophet forecast overlay ─────────────────────────────────────
    if (showForecast && forecastData && forecastData.length > 0) {

      // Transform Prophet output → LineSeries format
      const line  = forecastData.map(p => ({ time: p.time, value: p.yhat        }));
      const upper = forecastData.map(p => ({ time: p.time, value: p.yhat_upper  }));
      const lower = forecastData.map(p => ({ time: p.time, value: p.yhat_lower  }));

      // Upper confidence band (yhat_upper)
      chart.addSeries(LineSeries, {
        color:            "rgba(168, 85, 247, 0.25)",
        lineWidth:        1,
        lineStyle:        LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
        title:            "",
      }).setData(upper);

      // Central forecast line (yhat)
      chart.addSeries(LineSeries, {
        color:            "#a855f7",
        lineWidth:        2,
        lineStyle:        LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: true,
        title:            "Prophet",
      }).setData(line);

      // Lower confidence band (yhat_lower)
      chart.addSeries(LineSeries, {
        color:            "rgba(168, 85, 247, 0.25)",
        lineWidth:        1,
        lineStyle:        LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
        title:            "",
      }).setData(lower);

      chart.timeScale().fitContent();

    } else {
      chart.timeScale().fitContent();
    }

    // ── Resize handler ───────────────────────────────────────────────
    const handleResize = () => {
      if (chart && containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, forecastData, showForecast, assetColor]);

  if (loading) {
    return (
      <div className="h-105 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500">Loading chart data…</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-105 flex items-center justify-center text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full" />
      <div className="absolute top-2 left-2 flex items-center gap-4 text-xs pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-green-400 inline-block rounded" />
          <span className="text-gray-500">Bullish</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-red-400 inline-block rounded" />
          <span className="text-gray-500">Bearish</span>
        </span>
        {showForecast && forecastData && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-purple-400 inline-block" />
            <span className="text-purple-400">Prophet Forecast (Live)</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
