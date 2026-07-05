import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Card } from "@/components/ui/Card";
import { listCategories } from "@/lib/actions/categories";

export default async function NewExpensePage() {
  const customCategories = await listCategories();
  return (
    <div className="flex flex-col gap-4 pt-1">
      <Link
        href="/expenses"
        className="flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground"
      >
        <ChevronLeft size={16} /> Back
      </Link>
      <h1 className="text-2xl font-bold">Add expense</h1>
      <Card className="!p-5">
        <ExpenseForm customCategories={customCategories} />
      </Card>
    </div>
  );
}
