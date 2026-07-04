import Link from "next/link";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";

export default function NewExpensePage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/expenses" className="text-sm text-foreground/60 hover:text-foreground">
        ← Back
      </Link>
      <h1 className="text-xl font-semibold">Add Expense</h1>
      <ExpenseForm />
    </div>
  );
}
