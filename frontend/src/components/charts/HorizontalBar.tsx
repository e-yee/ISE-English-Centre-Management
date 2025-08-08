import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type HorizontalBarDatum = { label: string; value: number };

export default function HorizontalBar({
  data,
  color = "#2563EB", // tailwind blue-600
  height = 160,
  colors,
}: {
  data: HorizontalBarDatum[];
  color?: string;
  height?: number;
  colors?: string[];
}) {
  const sorted = [...data].sort((a, b) => a.value - b.value);
  const palette = colors && colors.length > 0 ? colors : ["#2563EB", "#1D4ED8"]; // blue-600 / blue-700
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={sorted} layout="vertical" margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" width={150} tick={{ fontSize: 12 }} />
          <Tooltip cursor={false} />
          <Bar dataKey="value" fill={color} radius={[4, 4, 4, 4]}>
            {sorted.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={palette[idx % palette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


