"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatINR } from "@/lib/utils/currency";

export function MonthlyTrendChart({ data }: { data: { label: string; amount: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis dataKey="label" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis hide />
        <Tooltip
          formatter={(value) => formatINR(Number(value))}
          contentStyle={{ background: "#18181f", border: "none", borderRadius: 8, color: "#fff" }}
        />
        <Bar dataKey="amount" fill="rgb(139, 92, 246)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
