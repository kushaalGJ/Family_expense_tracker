import { listExpenses } from "@/lib/actions/expenses";
import { listBudgets } from "@/lib/actions/budgets";
import { getMonthRange } from "@/lib/utils/dates";
import { CATEGORIES, DEFAULT_BUDGETS } from "@/lib/constants/categories";
import { BudgetCard } from "@/components/budgets/BudgetCard";

export default async function BudgetsPage() {
  const { start, end } = getMonthRange();
  const [expenses, budgets] = await Promise.all([
    listExpenses({ dateFrom: start, dateTo: end }),
    listBudgets(),
  ]);

  const budgetByCategory = new Map(budgets.map((b) => [b.category, b.monthly_limit]));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Budgets</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const spent = expenses
            .filter((e) => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0);
          const limit = budgetByCategory.get(cat) ?? DEFAULT_BUDGETS[cat];
          return <BudgetCard key={cat} category={cat} spent={spent} limit={limit} />;
        })}
      </div>
    </div>
  );
}
