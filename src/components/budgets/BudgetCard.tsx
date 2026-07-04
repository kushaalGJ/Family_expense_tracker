"use client";

import { useState } from "react";
import { BudgetRing } from "@/components/budgets/BudgetRing";
import { BudgetEditModal } from "@/components/budgets/BudgetEditModal";
import { CATEGORY_META } from "@/lib/constants/categories";
import { formatINR } from "@/lib/utils/currency";
import type { Category } from "@/lib/types/database.types";

export function BudgetCard({
  category,
  spent,
  limit,
}: {
  category: Category;
  spent: number;
  limit: number;
}) {
  const [open, setOpen] = useState(false);
  const meta = CATEGORY_META[category];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass-card flex cursor-pointer flex-col items-center gap-2 p-4 hover:bg-white/10"
      >
        <div className="relative">
          <BudgetRing spent={spent} limit={limit} color={meta.color} />
          <div className="absolute inset-0 flex items-center justify-center text-lg">{meta.emoji}</div>
        </div>
        <div className="text-sm font-medium">{category}</div>
        <div className="text-center text-xs text-foreground/60">
          {formatINR(spent)} / {formatINR(limit)}
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
