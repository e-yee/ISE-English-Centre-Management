import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ColumnBarsDatum = { x: string | number; y: number };

export default function ColumnBars({
  data,
  color = "#2563EB", // tailwind blue-600
  height = 260,
  xTickFormatter,
  yTickFormatter,
  colors,
  highlightIndex,
  highlightColor = "#93C5FD", // blue-300
}: {
  data: ColumnBarsDatum[];
  color?: string;
  height?: number;
  xTickFormatter?: (v: any) => string;
  yTickFormatter?: (v: any) => string;
  colors?: string[];
  highlightIndex?: number;
  highlightColor?: string;
}) {
  const palette = colors && colors.length > 0 ? colors : ["#2563EB", "#1D4ED8"]; // blue-600 / blue-700
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <XAxis dataKey="x" tick={{ fontSize: 12 }} tickFormatter={xTickFormatter} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={yTickFormatter} />
          <Tooltip cursor={false} formatter={(v: any) => v} />
          <Bar dataKey="y" fill={color} radius={[6, 6, 0, 0]}>
            {data.map((_, idx) => {
              const fill = typeof highlightIndex === "number" && idx === highlightIndex
                ? highlightColor
                : palette[idx % palette.length];
              return <Cell key={`cell-${idx}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


