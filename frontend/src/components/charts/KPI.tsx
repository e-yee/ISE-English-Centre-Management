type KpiColor = 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'slate' | 'none';

export default function KPI({
  title,
  value,
  className = "",
  color = 'none',
}: {
  title: string;
  value: React.ReactNode;
  className?: string;
  color?: KpiColor;
}) {
  const palette: Record<KpiColor, { tile: string; value: string; title: string }> = {
    none: { tile: 'bg-white border-black/10', value: 'text-black', title: 'text-black/60' },
    blue: { tile: 'bg-blue-50 border-blue-200', value: 'text-blue-700', title: 'text-blue-800/70' },
    emerald: { tile: 'bg-emerald-50 border-emerald-200', value: 'text-emerald-700', title: 'text-emerald-800/70' },
    amber: { tile: 'bg-amber-50 border-amber-200', value: 'text-amber-700', title: 'text-amber-800/70' },
    violet: { tile: 'bg-violet-50 border-violet-200', value: 'text-violet-700', title: 'text-violet-800/70' },
    rose: { tile: 'bg-rose-50 border-rose-200', value: 'text-rose-700', title: 'text-rose-800/70' },
    slate: { tile: 'bg-slate-50 border-slate-200', value: 'text-slate-800', title: 'text-slate-600' },
  };

  const colors = palette[color] ?? palette.none;

  return (
    <div className={`${colors.tile} border rounded-xl p-4 shadow-sm ${className}`}>
      <div className={`text-xs uppercase tracking-wide ${colors.title}`}>{title}</div>
      <div className={`mt-1 ${colors.value}`}>{value}</div>
    </div>
  );
}


