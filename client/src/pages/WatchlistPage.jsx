import { useEffect, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { COINS, COIN_MAP } from "../constants/coins";
import {
  addWatchlistCoin,
  getWatchlistPrices,
  removeWatchlistCoin,
  reorderWatchlist,
} from "../services/watchlistService";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({});
  const [coinToAdd, setCoinToAdd] = useState("bitcoin");
  const [dragIndex, setDragIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWatchlist = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getWatchlistPrices();
      setWatchlist(data.watchlist || []);
      setPrices(data.prices || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
    const interval = setInterval(loadWatchlist, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = async () => {
    try {
      const data = await addWatchlistCoin(coinToAdd);
      setWatchlist(data.watchlist || []);
      loadWatchlist();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add coin");
    }
  };

  const handleRemove = async (coinId) => {
    try {
      const data = await removeWatchlistCoin(coinId);
      setWatchlist(data.watchlist || []);
      loadWatchlist();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove coin");
    }
  };

  const onDragStart = (index) => setDragIndex(index);
  const onDrop = async (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const reordered = [...watchlist];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setWatchlist(reordered);
    setDragIndex(null);
    try {
      await reorderWatchlist(reordered);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reorder watchlist");
    }
  };

  const availableToAdd = COINS.filter((coin) => !watchlist.includes(coin.id));

  return (
    <div className="min-h-screen bg-[#050010] text-white px-4 py-24 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-purple-300">Personalization</p>
          <h1 className="text-3xl font-black">Watchlist</h1>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-wrap gap-2">
          <select value={coinToAdd} onChange={(e) => setCoinToAdd(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-xl p-2 text-sm">
            {availableToAdd.length === 0 ? (
              <option value="">All coins added</option>
            ) : (
              availableToAdd.map((coin) => <option key={coin.id} value={coin.id}>{coin.name}</option>)
            )}
          </select>
          <button onClick={handleAdd} disabled={availableToAdd.length === 0}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-sm font-semibold">
            <Plus size={14} /> Add to Watchlist
          </button>
        </div>

        {error && <ErrorState message={error} onRetry={loadWatchlist} />}

        {loading ? (
          <LoadingSkeleton lines={10} />
        ) : watchlist.length === 0 ? (
          <EmptyState title="Your watchlist is empty" description="Add coins to monitor prices and quickly open forecasts." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {watchlist.map((coinId, index) => {
              const coin = COIN_MAP[coinId];
              const price = prices?.[coinId]?.usd;
              const change = prices?.[coinId]?.usd_24h_change;
              return (
                <div key={coinId}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(index)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <GripVertical size={14} className="text-gray-500 cursor-grab" />
                    <span className="text-xl">{coin?.icon}</span>
                    <div>
                      <p className="font-semibold">{coin?.name}</p>
                      <p className="text-xs text-gray-500">{coin?.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(price || 0).toLocaleString()}</p>
                    <p className={`text-xs ${Number(change || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {Number(change || 0).toFixed(2)}%
                    </p>
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <Link to="/dashboard" className="text-xs text-purple-300 hover:text-purple-200">Predict</Link>
                      <button onClick={() => handleRemove(coinId)} className="text-xs text-red-300 hover:text-red-200 inline-flex items-center gap-1">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

