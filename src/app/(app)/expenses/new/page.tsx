import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Card } from "@/components/ui/Card";

export default function NewExpensePage() {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/expenses"
        className="flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ChevronLeft size={16} /> Back
      </Link>
      <h1 className="text-xl font-semibold">Add expense</h1>
      <Card>
        <ExpenseForm />
      </Card>
    </div>
  );
}
