"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function Charts({
  data: { salesData },
}: {
  data: { salesData: { weeks: string; totalCompletedOrders: number }[] };
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={salesData}
        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
      >
        <XAxis
          dataKey="weeks"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#888888" }}
          tick={{ fill: "#888888" }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#888888" }}
          tickFormatter={(value) => `${value}`}
          tick={{ fill: "#888888" }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#fff", borderColor: "#ccc" }}
          cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
        />
        <Legend />
        <Bar
          dataKey="totalCompletedOrders"
          fill="#2563EB"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
