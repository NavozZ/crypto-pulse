const statusStyles = {
  accurate: "bg-green-500/15 text-green-300 border-green-500/30",
  partial: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  failed: "bg-red-500/15 text-red-300 border-red-500/30",
  pending: "bg-gray-500/15 text-gray-300 border-gray-500/30",
};

export default function StatusBadge({ status }) {
  const normalized = (status || "pending").toLowerCase();
  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return (
    <span className={`inline-flex rounded-lg border px-2 py-1 text-xs font-semibold ${statusStyles[normalized] || statusStyles.pending}`}>
      {label}
    </span>
  );
}

