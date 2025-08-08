import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type Part = { key: string; label: string; color?: string };

export default function StackedBar100({
  data,
  parts,
  height = 120,
}: {
  data: Record<string, number>; // e.g., { late: 15, onTime: 85 }
  parts: Part[]; // mapping order & colors
  height?: number;
}) {
  const sum = Object.values(data).reduce((a, b) => a + b, 0) || 1;
  const normalized = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, (v / sum) * 100])
  );
  const chartData = [{ name: "", ...normalized }];
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <XAxis dataKey="name" hide />
          <YAxis hide domain={[0, 100]} />
          <Tooltip cursor={false} formatter={(v: any, k: any) => [`${(v as number).toFixed(0)}%`, k]} />
          {parts.map((p) => (
            <Bar key={p.key} dataKey={p.key} stackId="a" fill={p.color || "#111111"} radius={[4, 4, 4, 4]} />
          ))}
          <Legend payload={parts.map((p) => ({ id: p.key, type: "square" as const, value: p.label, color: p.color || "#0ea5e9" }))} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


