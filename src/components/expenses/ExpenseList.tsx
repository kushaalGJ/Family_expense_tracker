import { ExpenseRow } from "@/components/expenses/ExpenseRow";
import type { Database } from "@/lib/types/database.types";

type ExpenseRowData = Database["public"]["Tables"]["expenses"]["Row"];

export function ExpenseList({ expenses }: { expenses: ExpenseRowData[] }) {
  if (expenses.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-foreground/50">
        No expenses match these filters yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {expenses.map((expense) => (
        <ExpenseRow key={expense.id} expense={expense} />
      ))}
    </div>
  );
}
