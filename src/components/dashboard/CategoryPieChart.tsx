"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORY_META } from "@/lib/constants/categories";
import { formatINR } from "@/lib/utils/currency";
import type { Category } from "@/lib/types/database.types";

export function CategoryPieChart({ data }: { data: { category: Category; amount: number }[] }) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted">
        No expenses logged this month yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.category} fill={CATEGORY_META[entry.category].color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatINR(Number(value))}
          contentStyle={{
            background: "rgb(var(--card))",
            border: "1px solid rgba(128,128,128,0.2)",
            borderRadius: 12,
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
