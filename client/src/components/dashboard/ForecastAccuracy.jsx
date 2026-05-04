
import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { API_BASE } from "../../api";

const ForecastAccuracy = ({ selectedAsset, userInfo }) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForecastHistory();
  }, [selectedAsset?.id, userInfo?.token]);

  const fetchForecastHistory = async () => {
    if (!selectedAsset?.id || !userInfo?.token) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `${API_BASE}/api/forecast-history?coin=${selectedAsset.id}&limit=7`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setHistory(data.history || []);

      // Fetch accuracy stats
      const statsResponse = await axios.get(
        `${API_BASE}/api/forecast-history/stats?coin=${selectedAsset.id}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setStats(statsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load forecast history");
      console.error("Error fetching forecast history:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy === null) return "text-gray-400";
    if (accuracy >= 95) return "text-green-500";
    if (accuracy < 80) return "text-red-500";
    return "text-yellow-500";
  };

  const getAccuracyBgColor = (accuracy) => {
    if (accuracy === null) return "bg-gray-100 dark:bg-gray-800";
    if (accuracy >= 95) return "bg-green-50 dark:bg-green-900/20";
    if (accuracy < 80) return "bg-red-50 dark:bg-red-900/20";
    return "bg-yellow-50 dark:bg-yellow-900/20";
  };

  // Simple chart using SVG
  const SimpleChart = () => {
    const chartData = history.slice().reverse();
    if (chartData.length === 0) return null;

    const maxPrice = Math.max(
      ...chartData.map(item => Math.max(item.predicted_price, item.actual_price || 0))
    );
    const minPrice = Math.min(
      ...chartData.map(item => Math.min(item.predicted_price, item.actual_price || item.predicted_price))
    );
    const priceRange = maxPrice - minPrice;

    const width = 700;
    const height = 250;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const points = chartData.map((item, i) => {
      const x = padding + (i / (chartData.length - 1 || 1)) * chartWidth;
      const yPredicted = padding + chartHeight - ((item.predicted_price - minPrice) / (priceRange || 1)) * chartHeight;
      const yActual = item.actual_price
        ? padding + chartHeight - ((item.actual_price - minPrice) / (priceRange || 1)) * chartHeight
        : yPredicted;
      return { x, yPredicted, yActual, ...item };
    });

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="text-gray-300">
        {/* Grid */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1={padding}
            y1={padding + (i * chartHeight) / 4}
            x2={width - padding}
            y2={padding + (i * chartHeight) / 4}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeDasharray="4"
          />
        ))}

        {/* Predicted line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={points.map(p => `${p.x},${p.yPredicted}`).join(" ")}
        />

        {/* Actual line */}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          points={points.map(p => `${p.x},${p.yActual}`).join(" ")}
        />

        {/* Legend */}
        <g>
          <line x1={width - 150} y1={15} x2={width - 130} y2={15} stroke="#3b82f6" strokeWidth="2" />
          <text x={width - 120} y={20} fontSize="12" fill="currentColor">Predicted</text>

          <line x1={width - 150} y1={35} x2={width - 130} y2={35} stroke="#10b981" strokeWidth="2" />
          <text x={width - 120} y={40} fontSize="12" fill="currentColor">Actual</text>
        </g>
      </svg>
    );
  };

  if (!selectedAsset || !userInfo) {
    return (
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-blue-300">Please select an asset to view forecast accuracy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          AI Forecast Accuracy — {selectedAsset.name}
        </h2>
        <button
          onClick={fetchForecastHistory}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : "Refresh"}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400 mr-2" />
          <p className="text-gray-400">Loading forecast history...</p>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            {
              label: "Average Accuracy",
              value: `${stats.average_accuracy?.toFixed(2) || 0}%`,
              icon: TrendingUp,
              color: "blue",
            },
            {
              label: "Best Accuracy",
              value: `${stats.best_accuracy?.toFixed(2) || 0}%`,
              icon: TrendingUp,
              color: "green",
            },
            {
              label: "Worst Accuracy",
              value: `${stats.worst_accuracy?.toFixed(2) || 0}%`,
              icon: TrendingDown,
              color: "red",
            },
            {
              label: "Total Predictions",
              value: stats.total_predictions || 0,
              icon: TrendingUp,
              color: "purple",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 transition`}
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <stat.icon className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {!loading && history.length > 0 && (
        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg overflow-x-auto">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Price Prediction vs Actual (Last 7 Days)
          </h3>
          <div className="min-w-full" style={{ minHeight: "250px" }}>
            <SimpleChart />
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && history.length > 0 && (
        <div className="overflow-x-auto bg-white/[0.02] border border-white/10 rounded-lg">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Predicted Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Actual Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {history.map((item) => (
                <tr key={item._id || item.date} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-300">
                    ${item.predicted_price?.toFixed(2) || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-300">
                    {item.actual_price ? `$${item.actual_price.toFixed(2)}` : "—"}
                  </td>
                  <td className={`px-4 py-3 text-xs font-bold ${getAccuracyColor(item.accuracy)}`}>
                    <span className={`px-2 py-1 rounded-md bg-white/5 border border-white/10`}>
                      {item.accuracy ? `${item.accuracy.toFixed(2)}%` : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && history.length === 0 && (
        <div className="p-8 text-center bg-white/[0.02] border border-white/10 rounded-lg">
          <TrendingUp className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            No forecast history available yet. Generate a forecast to start tracking accuracy.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForecastAccuracy;
