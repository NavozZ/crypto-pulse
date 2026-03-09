import { motion } from "framer-motion";
import { Star } from "lucide-react";

const AssetSidebar = ({ assets, selectedAsset, onAssetChange }) => {
  return (
    <aside className="w-20 md:w-56 flex-shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col overflow-y-auto">

      {/* Header — hidden on mobile */}
      <div className="hidden md:flex items-center gap-2 px-4 py-4 border-b border-white/10">
        <Star size={14} className="text-purple-400" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Assets</span>
      </div>

      {/* Asset List */}
      <nav className="flex flex-col gap-1 p-2">
        {assets.map((asset, i) => {
          const isActive = selectedAsset.id === asset.id;

          return (
            <motion.button
              key={asset.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onAssetChange(asset)}
              className={`group relative flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-xl transition-all text-left w-full ${
                isActive
                  ? "bg-purple-600/20 border border-purple-500/40"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ backgroundColor: asset.color }}
                />
              )}

              {/* Icon */}
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: asset.color + "22",
                  border: `1px solid ${asset.color}44`,
                  color: asset.color,
                }}
              >
                {asset.icon}
              </span>

              {/* Text — hidden on small sidebar */}
              <div className="hidden md:block min-w-0">
                <p className={`text-sm font-semibold leading-none ${isActive ? "text-white" : "text-gray-300"}`}>
                  {asset.symbol}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{asset.name}</p>
              </div>

              {/* Active dot on mobile */}
              {isActive && (
                <span
                  className="md:hidden absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: asset.color }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer note */}
      <div className="hidden md:block mt-auto px-4 py-4 border-t border-white/5">
        <p className="text-xs text-gray-600 text-center">
          Powered by CoinGecko API
        </p>
      </div>
    </aside>
  );
};

export default AssetSidebar;
