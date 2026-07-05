import { Users, Repeat, Trash2, Paperclip } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { formatINR } from "@/lib/utils/currency";
import { deleteExpense } from "@/lib/actions/expenses";
import { PAYMENT_ICON } from "@/lib/constants/payments";
import type { Database } from "@/lib/types/database.types";

type ExpenseRowData = Database["public"]["Tables"]["expenses"]["Row"];

export function ExpenseRow({ expense }: { expense: ExpenseRowData }) {
  const PayIcon = expense.payment_method ? PAYMENT_ICON[expense.payment_method] : null;
  return (
    <div className="card flex items-center gap-3 p-3.5">
      <CategoryIcon category={expense.category} size={44} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
          <span className="truncate">{expense.note || expense.category}</span>
          {expense.is_shared && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[rgb(var(--accent))]/12 px-2 py-0.5 text-[10px] font-semibold text-[rgb(var(--accent))]">
              <Users size={11} /> Shared
            </span>
          )}
          {expense.is_recurring && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-muted dark:bg-white/10">
              <Repeat size={11} /> Recurring
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
          <span>{expense.date}</span>
          <span>·</span>
          <span>{expense.category}</span>
          {PayIcon && (
            <>
              <span>·</span>
              <PayIcon size={12} />
              <span>{expense.payment_method}</span>
            </>
          )}
          {expense.attachment_url && <Paperclip size={12} className="text-[rgb(var(--accent))]" />}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="font-bold text-[rgb(var(--expense))]">−{formatINR(expense.amount)}</div>
        <form action={deleteExpense.bind(null, expense.id)}>
          <button
            type="submit"
            className="cursor-pointer text-muted transition-colors hover:text-[rgb(var(--expense))]"
            aria-label="Delete expense"
          >
            <Trash2 size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
