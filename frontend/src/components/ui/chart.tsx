import * as React from "react";
import { Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
type RechartsTooltipProps<TValue extends number | string = number, TName extends number | string = string> = {
  allowEscapeViewBox?: { x?: boolean; y?: boolean };
  content?: React.ReactElement | ((props: any) => React.ReactNode);
  cursor?: boolean | object;
  filterNull?: boolean;
  formatter?: (value: TValue, name: TName, item: any, index: number, payload: any[]) => any[] | React.ReactNode;
  itemSorter?: (item: any) => number | string;
  isAnimationActive?: boolean;
  label?: string | number;
  labelFormatter?: (label: any, payload: any) => React.ReactNode;
  labelStyle?: React.CSSProperties;
  offset?: number;
  payloadUniqBy?: (entry: any) => string | number;
  position?: { x: number; y: number };
  reverseDirection?: { x?: boolean; y?: boolean };
  separator?: string;
  trigger?: 'hover' | 'click';
  useTranslate3d?: boolean;
  wrapperStyle?: React.CSSProperties;
};

export type ChartConfig = Record<string, { label: string; color?: string }>;

export function ChartContainer({
  config,
  className,
  children,
}: {
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
}) {
  const style = React.useMemo<React.CSSProperties>(() => {
    const cssVars: Record<string, string> = {};
    Object.entries(config).forEach(([key, value], idx) => {
      const color = value.color || `hsl(${(idx * 57) % 360} 90% 50%)`;
      cssVars[`--color-${key}`] = color as string;
    });
    return cssVars as React.CSSProperties;
  }, [config]);

  return (
    <div className={className} style={style}>
      <div style={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          {/* children should be a single Recharts chart element */}
          {children as any}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ChartTooltip(props: RechartsTooltipProps<number, string>) {
  return <RechartsTooltip {...props} wrapperStyle={{ outline: "none" }} />;
}

export function ChartTooltipContent(
  props: RechartsTooltipProps<number, string> & { hideLabel?: boolean }
) {
  const { active, payload, label, hideLabel } = props as any;
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const name = item?.name ?? label;
  const value: number = item?.value ?? 0;
  const color: string = item?.payload?.fill || item?.color || "#8884d8";
  return (
    <div
      className="rounded-md border bg-white px-3 py-2 text-xs shadow-sm"
      style={{ borderColor: "rgba(0,0,0,0.1)" }}
    >
      {!hideLabel && <div className="mb-1 font-medium">{name}</div>}
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="font-medium">{value.toFixed(0)}%</span>
      </div>
    </div>
  );
}


