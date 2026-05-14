import StatusBadge from "../common/StatusBadge";
import { COIN_MAP } from "../../constants/coins";

export default function ForecastHistoryCard({ item }) {
  const coin = COIN_MAP[item.coin];
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{coin?.icon || "◉"}</span>
          <div>
            <p className="text-sm font-semibold text-white">{coin?.name || item.coin}</p>
            <p className="text-xs text-gray-500">
              {new Date(item.date).toLocaleString()} · {item.forecast_days}d horizon
            </p>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Predicted</p>
          <p className="text-white font-semibold">${Number(item.predicted_price || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Actual</p>
          <p className="text-white font-semibold">
            {item.actual_price !== null ? `$${Number(item.actual_price || 0).toLocaleString()}` : "Pending"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Accuracy</p>
          <p className="text-purple-300 font-semibold">
            {item.accuracy !== null ? `${Number(item.accuracy).toFixed(2)}%` : "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Confidence</p>
          <p className="text-purple-300 font-semibold">{Math.round(Number(item.confidence_score || 0))}%</p>
        </div>
      </div>
    </div>
  );
}

