import { useEffect, useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { COINS } from "../constants/coins";
import { fetchNewsSentiment } from "../services/newsSentimentService";
import FearGreedMeter from "../components/charts/FearGreedMeter";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

export default function NewsSentimentPage() {
  const [coin, setCoin] = useState("bitcoin");
  const [search, setSearch] = useState("");
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchNewsSentiment(coin, search);
      setNewsData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load news sentiment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [coin]);

  return (
    <div className="min-h-screen bg-[#050010] text-white px-4 py-24 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-purple-300">Intelligence</p>
          <h1 className="text-3xl font-black">News & Sentiment</h1>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 grid gap-3 md:grid-cols-3">
          <select className="bg-black/30 border border-white/10 rounded-xl p-2 text-sm"
            value={coin} onChange={(e) => setCoin(e.target.value)}>
            {COINS.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
          <div className="md:col-span-2 flex gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-3 text-gray-500" />
              <input
                className="w-full bg-black/30 border border-white/10 rounded-xl p-2 pl-9 text-sm"
                value={search}
                placeholder="Search headlines"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={load} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold">Apply</button>
          </div>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}

        {loading ? (
          <LoadingSkeleton lines={14} />
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-gray-400">Sentiment Score</p>
                <p className="text-4xl font-black mt-1">{Number(newsData?.sentiment?.compound || 0).toFixed(2)}</p>
                <p className="text-sm text-purple-300 mt-1">{newsData?.sentiment?.label || "Neutral"}</p>
                <p className="text-xs text-gray-400 mt-3">{newsData?.sentiment?.summary}</p>
              </div>
              <FearGreedMeter score={newsData?.fearGreed?.score || 50} label={newsData?.fearGreed?.label || "Neutral"} />
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm font-semibold text-gray-300 flex items-center gap-2"><TrendingUp size={14} /> Trending Topics</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(newsData?.trendingTopics || []).map((topic) => (
                    <span key={topic.topic} className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-xs text-purple-200">
                      {topic.topic} ({topic.mentions})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {(newsData?.news || []).length === 0 ? (
              <EmptyState title="No matching news found" description="Try a different keyword or coin filter." />
            ) : (
              <div className="grid gap-3">
                {(newsData?.news || []).map((item) => (
                  <a key={item.id} href={item.url} target="_blank" rel="noreferrer"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-purple-500/40 transition">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.source} · {new Date(item.publishedAt).toLocaleString()}</p>
                    {item.excerpt && <p className="text-sm text-gray-300 mt-2">{item.excerpt}</p>}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

