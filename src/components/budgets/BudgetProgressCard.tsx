"use client";

import { useState } from "react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BudgetEditModal } from "@/components/budgets/BudgetEditModal";
import { formatINR } from "@/lib/utils/currency";

export function BudgetProgressCard({
  category,
  spent,
  limit,
  color,
  icon,
}: {
  category: string;
  spent: number;
  limit: number;
  color?: string;
  icon?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const pct = limit > 0 ? (spent / limit) * 100 : 0;
  const over = spent > limit;
  const remaining = limit - spent;
  const barColor = over
    ? "rgb(var(--expense))"
    : pct > 80
      ? "#F59E0B"
      : "rgb(var(--accent))";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="card w-full p-4 text-left transition-transform active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <CategoryIcon category={category} color={color} icon={icon} size={44} />
          <div className="min-w-0 flex-1">
            <div className="font-semibold">{category}</div>
            <div className="text-xs text-muted">
              {formatINR(spent)} of {formatINR(limit)}
            </div>
          </div>
          <div className={`text-sm font-bold ${over ? "text-[rgb(var(--expense))]" : ""}`}>
            {Math.round(pct)}%
          </div>
        </div>
        <ProgressBar className="mt-3" pct={pct} color={barColor} />
        <div className="mt-2 text-xs font-medium">
          {over ? (
            <span className="text-[rgb(var(--expense))]">{formatINR(-remaining)} over budget</span>
          ) : (
            <span className="text-muted">
              <span className="text-[rgb(var(--income))]">{formatINR(remaining)}</span> remaining
            </span>
          )}
        </div>
      </button>
      <BudgetEditModal
        open={open}
        onClose={() => setOpen(false)}
        category={category}
        currentLimit={limit}
      />
    </>
  );
}
