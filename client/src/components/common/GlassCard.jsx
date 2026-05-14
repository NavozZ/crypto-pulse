export default function GlassCard({ className = "", children }) {
  return (
    <div className={`backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

