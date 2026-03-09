import { useEffect, useRef } from "react";
import { createChart, ColorType, CrosshairMode, LineStyle } from "lightweight-charts";

// ─── Forecast Generator (mock Prophet output) ─────────────────────────────
// This mimics what Facebook Prophet returns: yhat, yhat_lower, yhat_upper
// When the Python Node-Bridge is complete, replace this with real API data.
const generateProphetForecast = (historicalData) => {
  if (!historicalData || historicalData.length < 2) return { line: [], upper: [], lower: [] };

  const last = historicalData[historicalData.length - 1];
  const prev = historicalData[historicalData.length - 2];
  const trend = (last.close - prev.close) / prev.close; // short-term momentum

  const DAY = 86400;
  const line = [], upper = [], lower = [];

  // Anchor the forecast to the final historical candle
  line.push({ time: last.time, value: last.close });
  upper.push({ time: last.time, value: last.close * 1.005 });
  lower.push({ time: last.time, value: last.close * 0.995 });

  let value = last.close;

  for (let i = 1; i <= 14; i++) {
    // Dampening trend + slight mean-reversion + noise (Prophet-like additive model)
    const dampened = trend * Math.exp(-0.15 * i);
    const seasonal = 0.005 * Math.sin((2 * Math.PI * i) / 7); // weekly cycle s(t)
    const noise = (Math.random() - 0.5) * 0.008;
    value = value * (1 + dampened + seasonal + noise);

    const uncertainty = 0.015 + i * 0.004; // widening confidence interval
    const time = last.time + i * DAY;

    line.push({ time, value });
    upper.push({ time, value: value * (1 + uncertainty) });
    lower.push({ time, value: value * (1 - uncertainty) });
  }

  return { line, upper, lower };
};

// ─── PriceChart Component ─────────────────────────────────────────────────
const PriceChart = ({ data, showForecast, loading, assetColor }) => {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);

  useEffect(() => {
    // Defensive check — do not mount until container is ready (fixes TypeError)
    if (!containerRef.current) return;
    if (!data || data.length === 0) return;

    // Remove any previous instance before creating a new one
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // ── Chart Initialisation ─────────────────────────────────────────
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255, 255, 255, 0.6)",
        fontSize: 11,
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
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.08)",
        textColor: "rgba(255,255,255,0.5)",
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.08)",
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time) => {
          const d = new Date(time * 1000);
          return `${d.getDate()}/${d.getMonth() + 1}`;
        },
      },
      width:  containerRef.current.clientWidth,
      height: 420,
    });

    chartRef.current = chart;

    // ── Candlestick Series ──────────────────────────────────────────
    const candleSeries = chart.addCandlestickSeries({
      upColor:         "#4ade80",
      downColor:       "#f87171",
      borderUpColor:   "#4ade80",
      borderDownColor: "#f87171",
      wickUpColor:     "#4ade80",
      wickDownColor:   "#f87171",
    });
    candleSeries.setData(data);

    // ── Prophet Forecast Overlay ────────────────────────────────────
    if (showForecast) {
      const { line, upper, lower } = generateProphetForecast(data);

      // Upper confidence band
      chart.addLineSeries({
        color:     "rgba(168, 85, 247, 0.25)",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
        title: "",
      }).setData(upper);

      // Central Prophet forecast line (yhat)
      chart.addLineSeries({
        color:            "#a855f7",
        lineWidth:        2,
        lineStyle:        LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: true,
        title:            "Prophet",
      }).setData(line);

      // Lower confidence band
      chart.addLineSeries({
        color:     "rgba(168, 85, 247, 0.25)",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
        title: "",
      }).setData(lower);

      // Fit view to include forecast
      chart.timeScale().fitContent();
    } else {
      chart.timeScale().fitContent();
    }

    // ── Responsive Resize Handler ──────────────────────────────────
    const handleResize = () => {
      if (chart && containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, showForecast, assetColor]);

  // ── Render ───────────────────────────────────────────────────────
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

      {/* Legend */}
      <div className="absolute top-2 left-2 flex items-center gap-4 text-xs pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-green-400 inline-block rounded" />
          <span className="text-gray-500">Bullish</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-red-400 inline-block rounded" />
          <span className="text-gray-500">Bearish</span>
        </span>
        {showForecast && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-purple-400 inline-block" />
            <span className="text-purple-400">Prophet Forecast</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
