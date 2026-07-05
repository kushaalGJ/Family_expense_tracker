"use client";

import { useState } from "react";
import { BudgetRing } from "@/components/budgets/BudgetRing";
import { BudgetEditModal } from "@/components/budgets/BudgetEditModal";
import { CATEGORY_META } from "@/lib/constants/categories";
import { CATEGORY_ICON } from "@/lib/constants/categoryIcons";
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
  const color = CATEGORY_META[category].color;
  const Icon = CATEGORY_ICON[category];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="card flex cursor-pointer flex-col items-center gap-2 p-4 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/5"
      >
        <div className="relative">
          <BudgetRing spent={spent} limit={limit} color={color} />
          <div className="absolute inset-0 flex items-center justify-center" style={{ color }}>
            <Icon size={22} />
          </div>
        </div>
        <div className="text-sm font-medium">{category}</div>
        <div className="text-center text-xs text-muted">
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
