import { Users, Repeat, Trash2 } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { formatINR } from "@/lib/utils/currency";
import { deleteExpense } from "@/lib/actions/expenses";
import type { Database } from "@/lib/types/database.types";

type ExpenseRowData = Database["public"]["Tables"]["expenses"]["Row"];

export function ExpenseRow({ expense }: { expense: ExpenseRowData }) {
  return (
    <div className="card flex items-center gap-3 p-3">
      <CategoryIcon category={expense.category} size={42} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
          <span className="truncate">{expense.note || expense.category}</span>
          {expense.is_shared && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[rgb(var(--accent))]/12 px-2 py-0.5 text-[10px] font-medium text-[rgb(var(--accent))]">
              <Users size={11} /> Shared
            </span>
          )}
          {expense.is_recurring && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-muted dark:bg-white/10">
              <Repeat size={11} /> Recurring
            </span>
          )}
        </div>
        <div className="text-xs text-muted">
          {expense.date} · {expense.category}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="font-semibold text-[rgb(var(--expense))]">−{formatINR(expense.amount)}</div>
        <form action={deleteExpense.bind(null, expense.id)}>
          <button
            type="submit"
            className="cursor-pointer text-muted hover:text-[rgb(var(--expense))]"
            aria-label="Delete expense"
          >
            <Trash2 size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
