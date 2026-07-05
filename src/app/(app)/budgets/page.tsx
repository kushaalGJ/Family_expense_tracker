import { listExpenses } from "@/lib/actions/expenses";
import { listBudgets } from "@/lib/actions/budgets";
import { listCategories } from "@/lib/actions/categories";
import { getMonthRange } from "@/lib/utils/dates";
import { CATEGORIES, DEFAULT_BUDGETS } from "@/lib/constants/categories";
import { formatINR } from "@/lib/utils/currency";
import { BudgetProgressCard } from "@/components/budgets/BudgetProgressCard";
import { CategoryManager } from "@/components/budgets/CategoryManager";

export default async function BudgetsPage() {
  const { start, end } = getMonthRange();
  const [expenses, budgets, customCategories] = await Promise.all([
    listExpenses({ dateFrom: start, dateTo: end }),
    listBudgets(),
    listCategories(),
  ]);

  const budgetByCategory = new Map(budgets.map((b) => [b.category, b.monthly_limit]));
  const spentByCategory = (cat: string) =>
    expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);

  const rows = [
    ...CATEGORIES.map((cat) => ({
      name: cat as string,
      color: undefined as string | undefined,
      icon: undefined as string | null | undefined,
      spent: spentByCategory(cat),
      limit: budgetByCategory.get(cat) ?? DEFAULT_BUDGETS[cat],
    })),
    ...customCategories.map((c) => ({
      name: c.name,
      color: c.color,
      icon: c.icon,
      spent: spentByCategory(c.name),
      limit: budgetByCategory.get(c.name) ?? 0,
    })),
  ];

  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  const totalLimit = rows.reduce((s, r) => s + r.limit, 0);

  return (
    <div className="flex flex-col gap-5 pt-1">
      <h1 className="text-2xl font-bold">Budgets</h1>

      <div className="card gradient-accent overflow-hidden !border-0 p-5 text-white">
        <div className="text-sm font-medium text-white/80">Spent this month</div>
        <div className="mt-1 text-3xl font-extrabold">{formatINR(totalSpent)}</div>
        <div className="mt-1 text-sm text-white/80">of {formatINR(totalLimit)} budgeted</div>
      </div>

      <div className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <BudgetProgressCard
            key={r.name}
            category={r.name}
            color={r.color}
            icon={r.icon}
            spent={r.spent}
            limit={r.limit}
          />
        ))}
      </div>

      <CategoryManager categories={customCategories} />
    </div>
  );
}
