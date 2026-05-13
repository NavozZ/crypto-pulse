import { useEffect, useState } from "react";
import { Brain, Bookmark } from "lucide-react";
import { COINS } from "../constants/coins";
import { fetchAIExplanation } from "../services/aiExplanationService";
import { saveForecast } from "../services/profileService";
import AIExplanationCard from "../components/forecast/AIExplanationCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import ErrorState from "../components/common/ErrorState";

export default function AIExplanationPage() {
  const [coin, setCoin] = useState("bitcoin");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchAIExplanation(coin);
      setData(response);
      setSaved(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load AI explanation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [coin]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setError("");
    try {
      await saveForecast({
        coin,
        direction: data.prediction,
        confidence: data.confidence,
        summary: data.reasoning?.summary || "",
      });
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save forecast");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050010] text-white px-4 py-24 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-purple-300">AI Explainability</p>
            <h1 className="text-3xl font-black flex items-center gap-2"><Brain className="text-purple-400" /> Prediction Reasoning</h1>
          </div>
          <select className="bg-black/30 border border-white/10 rounded-xl p-2 text-sm"
            value={coin} onChange={(e) => setCoin(e.target.value)}>
            {COINS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}

        {loading ? (
          <LoadingSkeleton lines={12} />
        ) : (
          <>
            <AIExplanationCard
              prediction={data?.prediction}
              confidence={data?.confidence}
              reasoning={data?.reasoning}
              status="pending"
            />

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Indicator Snapshot</h3>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <p className="rounded-xl bg-white/5 p-3"><strong>RSI:</strong> {data?.indicators?.rsi}</p>
                <p className="rounded-xl bg-white/5 p-3"><strong>MACD:</strong> {data?.indicators?.macdSignal}</p>
                <p className="rounded-xl bg-white/5 p-3"><strong>Sentiment:</strong> {data?.indicators?.sentimentLabel} ({Number(data?.indicators?.sentimentScore || 0).toFixed(2)})</p>
                <p className="rounded-xl bg-white/5 p-3"><strong>Volatility:</strong> {Number(data?.indicators?.volatility || 0).toFixed(2)}%</p>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold">
              <Bookmark size={14} /> {saving ? "Saving..." : saved ? "Saved" : "Save Forecast to Profile"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

