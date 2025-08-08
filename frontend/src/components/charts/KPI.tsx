export default function KPI({ title, value, className = "" }: { title: string; value: number | string; className?: string }) {
  return (
    <div className={`bg-white border border-black/10 rounded-xl p-4 shadow-sm ${className}`}>
      <div className="text-xs uppercase tracking-wide text-black/60">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}


