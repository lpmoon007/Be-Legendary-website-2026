"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { scoreColor } from "@/lib/metrics";

export interface ChartPoint {
  date: string; // YYYY-MM-DD
  label: string; // short display label (M/D)
  score: number | null;
}

// Colored dots by score band; nulls (missed days) leave a gap in the line.
function ScoreDot(props: any) {
  const { cx, cy, value } = props;
  if (value == null || cx == null || cy == null) return null;
  return <Dot cx={cx} cy={cy} r={4} fill={scoreColor(value)} stroke="none" />;
}

export function ScoreChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -18 }}>
          <CartesianGrid stroke="#8A7F6C" strokeOpacity={0.15} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#8A7F6C", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#8A7F6C", strokeOpacity: 0.25 }}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fill: "#8A7F6C", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#1B1810",
              border: "none",
              borderRadius: 10,
              color: "#F4F0E7",
              fontSize: 13,
            }}
            labelStyle={{ color: "#8A7F6C" }}
            formatter={(v: any) => [v ?? "—", "Score"]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#C04A26"
            strokeWidth={2}
            connectNulls={false}
            dot={<ScoreDot />}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
