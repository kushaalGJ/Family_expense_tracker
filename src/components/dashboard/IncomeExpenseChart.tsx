"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatINR } from "@/lib/utils/currency";

type Point = { label: string; income: number; expense: number };

export function IncomeExpenseChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} vertical={false} />
        <XAxis dataKey="label" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "currentColor", fillOpacity: 0.05 }}
          formatter={(value, name) => [formatINR(Number(value)), name === "income" ? "Income" : "Expense"]}
          contentStyle={{
            background: "rgb(var(--card))",
            border: "1px solid rgba(128,128,128,0.2)",
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span className="text-xs text-muted">{v === "income" ? "Income" : "Expense"}</span>}
        />
        <Bar dataKey="income" fill="rgb(var(--income))" radius={[6, 6, 0, 0]} maxBarSize={18} />
        <Bar dataKey="expense" fill="rgb(var(--accent))" radius={[6, 6, 0, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
