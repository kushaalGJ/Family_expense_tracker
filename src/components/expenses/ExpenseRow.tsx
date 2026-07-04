import { CATEGORY_META } from "@/lib/constants/categories";
import { formatINR } from "@/lib/utils/currency";
import { deleteExpense } from "@/lib/actions/expenses";
import type { Database } from "@/lib/types/database.types";

type ExpenseRowData = Database["public"]["Tables"]["expenses"]["Row"];

export function ExpenseRow({ expense }: { expense: ExpenseRowData }) {
  const meta = CATEGORY_META[expense.category];

  return (
    <div className="glass-card flex items-center gap-3 p-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
        style={{ backgroundColor: `${meta.color}33` }}
      >
        {meta.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
          <span className="truncate">{expense.note || expense.category}</span>
          {expense.is_shared && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-normal">
              👨‍👩‍👧 Shared
            </span>
          )}
          {expense.is_recurring && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-normal">
              🔁 Recurring
            </span>
          )}
        </div>
        <div className="text-xs text-foreground/50">
          {expense.date} · {expense.category}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="font-semibold">{formatINR(expense.amount)}</div>
        <form action={deleteExpense.bind(null, expense.id)}>
          <button
            type="submit"
            className="cursor-pointer text-foreground/40 hover:text-red-400"
            aria-label="Delete expense"
          >
            🗑️
          </button>
        </form>
      </div>
    </div>
  );
}
