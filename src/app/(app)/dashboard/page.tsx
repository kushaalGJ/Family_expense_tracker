import { listExpenses } from "@/lib/actions/expenses";
import { listIncome } from "@/lib/actions/income";
import { listBudgets } from "@/lib/actions/budgets";
import { listReminders } from "@/lib/actions/reminders";
import { CATEGORIES, DEFAULT_BUDGETS } from "@/lib/constants/categories";
import { getMonthRange, getLastNMonths, parseISODate } from "@/lib/utils/dates";
import { Card } from "@/components/ui/Card";
import { SafeToSpendCard } from "@/components/dashboard/SafeToSpendCard";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { TopCategoriesList } from "@/components/dashboard/TopCategoriesList";
import { OverBudgetAlerts } from "@/components/dashboard/OverBudgetAlerts";
import { ReminderSection } from "@/components/dashboard/ReminderSection";
import { AddIncomeButton } from "@/components/dashboard/AddIncomeButton";

export default async function DashboardPage() {
  const { start, end } = getMonthRange();
  const months = getLastNMonths(6);
  const trendStart = { year: months[0].year, month: months[0].month };
  const trendRangeStart = `${trendStart.year}-${String(trendStart.month + 1).padStart(2, "0")}-01`;

  const [trendExpenses, monthIncome, budgets, reminders] = await Promise.all([
    listExpenses({ dateFrom: trendRangeStart, dateTo: end }),
    listIncome(start, end),
    listBudgets(),
    listReminders(),
  ]);

  const monthExpenses = trendExpenses.filter((e) => e.date >= start && e.date <= end);

  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = monthIncome.reduce((sum, i) => sum + i.amount, 0);

  const budgetByCategory = new Map(budgets.map((b) => [b.category, b.monthly_limit]));
  const totalBudget = CATEGORIES.reduce(
    (sum, cat) => sum + (budgetByCategory.get(cat) ?? DEFAULT_BUDGETS[cat]),
    0
  );

  const categoryTotals = CATEGORIES.map((cat) => ({
    category: cat,
    amount: monthExpenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.amount > 0);

  const topCategories = [...categoryTotals].sort((a, b) => b.amount - a.amount).slice(0, 3);

  const overBudget = CATEGORIES.map((cat) => {
    const limit = budgetByCategory.get(cat) ?? DEFAULT_BUDGETS[cat];
    const spent = categoryTotals.find((c) => c.category === cat)?.amount ?? 0;
    return { category: cat, limit, spent };
  }).filter((c) => c.spent > c.limit);

  const safeToSpend = (totalIncome > 0 ? totalIncome : totalBudget) - totalSpent;

  const monthlyTrend = months.map(({ year, month, label }) => {
    const amount = trendExpenses
      .filter((e) => {
        const parsed = parseISODate(e.date);
        return parsed.year === year && parsed.month === month;
      })
      .reduce((sum, e) => sum + e.amount, 0);
    return { label, amount };
  });

  return (
    <div className="flex flex-col gap-4">
      <SafeToSpendCard safeToSpend={safeToSpend} totalIncome={totalIncome} totalSpent={totalSpent} />

      <OverBudgetAlerts items={overBudget} />

      <Card>
        <h2 className="mb-2 text-sm font-semibold text-foreground/80">Spending by category</h2>
        <CategoryPieChart data={categoryTotals} />
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold text-foreground/80">Last 6 months</h2>
        <MonthlyTrendChart data={monthlyTrend} />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground/80">Top categories</h2>
        <TopCategoriesList data={topCategories} total={totalSpent} />
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-sm text-foreground/60">Income this month</div>
          <div className="text-lg font-semibold">₹{totalIncome.toLocaleString("en-IN")}</div>
        </div>
        <AddIncomeButton />
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground/80">Bill reminders</h2>
        <ReminderSection reminders={reminders} />
      </div>
    </div>
  );
}
