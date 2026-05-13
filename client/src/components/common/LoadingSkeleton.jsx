export default function LoadingSkeleton({ lines = 4, className = "" }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-3 rounded bg-white/10" />
      ))}
    </div>
  );
}

