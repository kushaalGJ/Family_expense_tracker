import { listExpenses } from "@/lib/actions/expenses";
import { listIncome } from "@/lib/actions/income";
import { listBudgets } from "@/lib/actions/budgets";
import { listReminders } from "@/lib/actions/reminders";
import { CATEGORIES, DEFAULT_BUDGETS } from "@/lib/constants/categories";
import { getMonthRange, getLastNMonths, parseISODate } from "@/lib/utils/dates";
import { Card } from "@/components/ui/Card";
import { SafeToSpendCard } from "@/components/dashboard/SafeToSpendCard";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { TopCategoriesList } from "@/components/dashboard/TopCategoriesList";
import { OverBudgetAlerts } from "@/components/dashboard/OverBudgetAlerts";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ReminderSection } from "@/components/dashboard/ReminderSection";
import { AddIncomeButton } from "@/components/dashboard/AddIncomeButton";

function resolveMonth(param?: string): Date {
  if (param && /^\d{4}-\d{2}$/.test(param)) {
    const [y, m] = param.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }
  return new Date();
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const selected = resolveMonth(monthParam);
  const { start, end } = getMonthRange(selected);
  const months = getLastNMonths(6, selected);
  const trendRangeStart = `${months[0].year}-${String(months[0].month + 1).padStart(2, "0")}-01`;

  const [trendExpenses, trendIncome, budgets, reminders] = await Promise.all([
    listExpenses({ dateFrom: trendRangeStart, dateTo: end }),
    listIncome(trendRangeStart, end),
    listBudgets(),
    listReminders(),
  ]);

  const monthExpenses = trendExpenses.filter((e) => e.date >= start && e.date <= end);
  const monthIncomeRows = trendIncome.filter((i) => i.date >= start && i.date <= end);

  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = monthIncomeRows.reduce((s, i) => s + i.amount, 0);

  const prev = new Date(selected.getFullYear(), selected.getMonth() - 1, 1);
  const prevRange = getMonthRange(prev);
  const prevSpent = trendExpenses
    .filter((e) => e.date >= prevRange.start && e.date <= prevRange.end)
    .reduce((s, e) => s + e.amount, 0);

  const budgetByCategory = new Map(budgets.map((b) => [b.category, b.monthly_limit]));
  const totalBudget = CATEGORIES.reduce(
    (s, cat) => s + (budgetByCategory.get(cat) ?? DEFAULT_BUDGETS[cat]),
    0
  );

  const categoryTotals = CATEGORIES.map((cat) => ({
    category: cat,
    amount: monthExpenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.amount > 0);

  const topCategories = [...categoryTotals].sort((a, b) => b.amount - a.amount).slice(0, 3);

  const overBudget = CATEGORIES.map((cat) => {
    const limit = budgetByCategory.get(cat) ?? DEFAULT_BUDGETS[cat];
    const spent = categoryTotals.find((c) => c.category === cat)?.amount ?? 0;
    return { category: cat, limit, spent };
  }).filter((c) => c.spent > c.limit);

  const safeToSpend = (totalIncome > 0 ? totalIncome : totalBudget) - totalSpent;

  const monthlyTrend = months.map(({ year, month, label }) => {
    const inMonth = (d: string) => {
      const p = parseISODate(d);
      return p.year === year && p.month === month;
    };
    return {
      label,
      expense: trendExpenses.filter((e) => inMonth(e.date)).reduce((s, e) => s + e.amount, 0),
      income: trendIncome.filter((i) => inMonth(i.date)).reduce((s, i) => s + i.amount, 0),
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <MonthSelector year={selected.getFullYear()} month={selected.getMonth()} />
      </div>

      <SafeToSpendCard
        safeToSpend={safeToSpend}
        totalIncome={totalIncome}
        totalSpent={totalSpent}
        totalBudget={totalBudget}
        prevSpent={prevSpent}
      />

      <OverBudgetAlerts items={overBudget} />

      <Card>
        <h2 className="mb-2 text-sm font-semibold">Income vs expense</h2>
        <IncomeExpenseChart data={monthlyTrend} />
      </Card>

      <RecentTransactions expenses={monthExpenses} />

      {categoryTotals.length > 0 && (
        <Card>
          <h2 className="mb-3 text-sm font-semibold">Top categories</h2>
          <TopCategoriesList data={topCategories} total={totalSpent} />
          <div className="mt-2">
            <CategoryPieChart data={categoryTotals} />
          </div>
        </Card>
      )}

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted">Income this month</div>
          <div className="text-lg font-semibold">₹{totalIncome.toLocaleString("en-IN")}</div>
        </div>
        <AddIncomeButton />
      </Card>

      <div>
        <h2 className="mb-2 px-1 text-sm font-semibold">Bill reminders</h2>
        <ReminderSection reminders={reminders} />
      </div>
    </div>
  );
}
