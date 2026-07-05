import { Receipt } from "lucide-react";
import { ExpenseRow } from "@/components/expenses/ExpenseRow";
import type { Database } from "@/lib/types/database.types";

type ExpenseRowData = Database["public"]["Tables"]["expenses"]["Row"];

export function ExpenseList({ expenses }: { expenses: ExpenseRowData[] }) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]">
          <Receipt size={34} strokeWidth={1.6} />
        </span>
        <div className="text-lg font-bold">No expenses yet</div>
        <p className="max-w-[220px] text-sm text-muted">
          Tap the <span className="font-semibold text-[rgb(var(--accent))]">+</span> button to add your
          first expense.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {expenses.map((expense) => (
        <ExpenseRow key={expense.id} expense={expense} />
      ))}
    </div>
  );
}
