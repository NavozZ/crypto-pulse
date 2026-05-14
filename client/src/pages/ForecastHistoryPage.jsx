import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, History, ChevronLeft, ChevronRight } from "lucide-react";
import { COINS } from "../constants/coins";
import { fetchForecastHistory, fetchForecastHistoryStats } from "../services/forecastHistoryService";
import ForecastHistoryCard from "../components/forecast/ForecastHistoryCard";
import AccuracyTrendChart from "../components/charts/AccuracyTrendChart";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

const initialFilters = {
  coin: "bitcoin",
  timeframe: "",
  direction: "",
  status: "",
};

export default function ForecastHistoryPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [historyData, setHistoryData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const params = useMemo(() => ({
    ...filters,
    page,
    limit: 8,
  }), [filters, page]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [history, stat] = await Promise.all([
        fetchForecastHistory(params),
        fetchForecastHistoryStats(filters.coin || undefined),
      ]);
      setHistoryData(history);
      setStats(stat);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load forecast history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.coin, params.timeframe, params.direction, params.status, params.page]);

  return (
    <div className="min-h-screen bg-[#050010] text-white px-4 py-24 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-purple-300">Forecast System</p>
            <h1 className="text-3xl md:text-4xl font-black flex items-center gap-2">
              <History className="text-purple-400" /> Forecast History
            </h1>
          </div>
          <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition">Back to Dashboard</Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Filter size={14} /> Filters
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <select className="bg-black/30 border border-white/10 rounded-xl p-2 text-sm"
              value={filters.coin} onChange={(e) => { setPage(1); setFilters((s) => ({ ...s, coin: e.target.value })); }}>
              {COINS.map((coin) => <option key={coin.id} value={coin.id}>{coin.name}</option>)}
            </select>
            <select className="bg-black/30 border border-white/10 rounded-xl p-2 text-sm"
              value={filters.timeframe} onChange={(e) => { setPage(1); setFilters((s) => ({ ...s, timeframe: e.target.value })); }}>
              <option value="">All Timeframes</option>
              <option value="7">7D</option>
              <option value="14">14D</option>
              <option value="30">30D</option>
            </select>
            <select className="bg-black/30 border border-white/10 rounded-xl p-2 text-sm"
              value={filters.direction} onChange={(e) => { setPage(1); setFilters((s) => ({ ...s, direction: e.target.value })); }}>
              <option value="">All Directions</option>
              <option value="bullish">Bullish</option>
              <option value="bearish">Bearish</option>
            </select>
            <select className="bg-black/30 border border-white/10 rounded-xl p-2 text-sm"
              value={filters.status} onChange={(e) => { setPage(1); setFilters((s) => ({ ...s, status: e.target.value })); }}>
              <option value="">All Statuses</option>
              <option value="accurate">Accurate</option>
              <option value="partial">Partial</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {error && <ErrorState message={error} onRetry={loadData} />}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            <LoadingSkeleton className="rounded-xl border border-white/10 p-4" lines={8} />
            <LoadingSkeleton className="rounded-xl border border-white/10 p-4" lines={8} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Average Accuracy", value: `${Number(stats?.average_accuracy || 0).toFixed(2)}%` },
                { label: "Average Confidence", value: `${Number(stats?.average_confidence || 0).toFixed(0)}%` },
                { label: "Accurate Predictions", value: stats?.accurate_count || 0 },
                { label: "Total Predictions", value: stats?.total_predictions || 0 },
              ].map((card) => (
                <div key={card.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-gray-500">{card.label}</p>
                  <p className="text-xl font-bold text-white mt-1">{card.value}</p>
                </div>
              ))}
            </div>

            <AccuracyTrendChart points={historyData?.trend || []} />

            {(historyData?.history || []).length === 0 ? (
              <EmptyState title="No forecast history found" description="Generate forecasts from the dashboard to build your historical tracking." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {(historyData?.history || []).map((item) => (
                  <ForecastHistoryCard key={item._id || item.date} item={item} />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-xl border border-white/10 disabled:opacity-50"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <p className="text-sm text-gray-400">
                Page {historyData?.page || page} of {historyData?.totalPages || 1}
              </p>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (historyData?.totalPages || 1)}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-xl border border-white/10 disabled:opacity-50"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

