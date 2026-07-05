import Link from "next/link";
import { ChevronRight, TrendingDown, TrendingUp, Flame, ShieldCheck, AlertTriangle, Users, CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { resolveModeContext } from "@/lib/mode";
import { listExpenses } from "@/lib/actions/expenses";
import { listIncome } from "@/lib/actions/income";
import { listBudgets } from "@/lib/actions/budgets";
import { listReminders } from "@/lib/actions/reminders";
import { listGoals } from "@/lib/actions/goals";
import { getFamilyLeaderboard } from "@/lib/actions/family";
import { CATEGORIES, DEFAULT_BUDGETS } from "@/lib/constants/categories";
import { getMonthRange, getLastNMonths, parseISODate } from "@/lib/utils/dates";
import { formatINR } from "@/lib/utils/currency";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { HeroBalanceCard } from "@/components/dashboard/HeroBalanceCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { InsightCards, type Insight } from "@/components/dashboard/InsightCards";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { TopCategoriesList } from "@/components/dashboard/TopCategoriesList";
import { OverBudgetAlerts } from "@/components/dashboard/OverBudgetAlerts";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ReminderSection } from "@/components/dashboard/ReminderSection";

function resolveMonth(param?: string): Date {
  if (param && /^\d{4}-\d{2}$/.test(param)) {
    const [y, m] = param.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }
  return new Date();
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-3 flex items-center justify-between px-1">
      <h2 className="text-[17px] font-bold">{title}</h2>
      <Link href={href} className="flex items-center text-xs font-semibold text-[rgb(var(--accent))]">
        See all <ChevronRight size={14} />
      </Link>
    </div>
  );
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const modeCtx = user ? await resolveModeContext(supabase, user) : null;

  const [trendExpenses, trendIncome, budgets, reminders, goals] = await Promise.all([
    listExpenses({ dateFrom: trendRangeStart, dateTo: end }),
    listIncome(trendRangeStart, end),
    listBudgets(),
    listReminders(),
    listGoals(),
  ]);

  const familyLeaderboard =
    modeCtx?.mode === "family" && modeCtx.familyId
      ? await getFamilyLeaderboard(modeCtx.familyId)
      : [];

  const monthExpenses = trendExpenses.filter((e) => e.date >= start && e.date <= end);
  const monthIncomeRows = trendIncome.filter((i) => i.date >= start && i.date <= end);

  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = monthIncomeRows.reduce((s, i) => s + i.amount, 0);
  const totalSavings = goals.reduce((s, g) => s + g.saved, 0);
  const balance = totalIncome - totalSpent;

  const prev = new Date(selected.getFullYear(), selected.getMonth() - 1, 1);
  const prevRange = getMonthRange(prev);
  const prevSpent = trendExpenses
    .filter((e) => e.date >= prevRange.start && e.date <= prevRange.end)
    .reduce((s, e) => s + e.amount, 0);

  const budgetByCategory = new Map(budgets.map((b) => [b.category, b.monthly_limit]));

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

  // Budget progress preview: highest-utilization categories
  const budgetProgress = CATEGORIES.map((cat) => {
    const limit = budgetByCategory.get(cat) ?? DEFAULT_BUDGETS[cat];
    const spent = categoryTotals.find((c) => c.category === cat)?.amount ?? 0;
    return { category: cat, limit, spent, pct: limit > 0 ? (spent / limit) * 100 : 0 };
  })
    .filter((b) => b.spent > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  // ---- Insights ----
  const insights: Insight[] = [];
  if (prevSpent > 0) {
    const pct = Math.round(((totalSpent - prevSpent) / prevSpent) * 100);
    insights.push({
      id: "vs-last",
      icon: pct > 0 ? TrendingUp : TrendingDown,
      tone: pct > 0 ? "bad" : "good",
      text: `You spent ${Math.abs(pct)}% ${pct > 0 ? "more" : "less"} than last month.`,
    });
  }
  if (topCategories.length > 0) {
    insights.push({
      id: "top-cat",
      icon: Flame,
      tone: "neutral",
      text: `${topCategories[0].category} is your highest spending category.`,
    });
  }
  insights.push(
    overBudget.length > 0
      ? {
          id: "budget",
          icon: AlertTriangle,
          tone: "bad",
          text: `You're over budget in ${overBudget.length} categor${overBudget.length === 1 ? "y" : "ies"}.`,
        }
      : { id: "budget", icon: ShieldCheck, tone: "good", text: "You're within your monthly budget." }
  );
  if (familyLeaderboard.length > 0) {
    const familyTotal = familyLeaderboard.reduce((s, m) => s + m.total, 0);
    insights.push({
      id: "family",
      icon: Users,
      tone: "neutral",
      text: `Your family spent ${formatINR(familyTotal)} this month.`,
    });
  }
  const today = new Date().getDate();
  const upcoming = [...reminders].filter((r) => r.due_day >= today).sort((a, b) => a.due_day - b.due_day)[0];
  if (upcoming) {
    const days = upcoming.due_day - today;
    insights.push({
      id: "reminder",
      icon: CalendarClock,
      tone: days <= 3 ? "bad" : "neutral",
      text: `${upcoming.title} due ${days === 0 ? "today" : `in ${days} day${days === 1 ? "" : "s"}`}.`,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end pt-1">
        <MonthSelector year={selected.getFullYear()} month={selected.getMonth()} />
      </div>

      <HeroBalanceCard balance={balance} income={totalIncome} expense={totalSpent} savings={totalSavings} />

      <QuickActions />

      <InsightCards insights={insights} />

      <OverBudgetAlerts items={overBudget} />

      <Card className="!p-5">
        <h2 className="mb-3 text-[17px] font-bold">Income vs expense</h2>
        <IncomeExpenseChart data={monthlyTrend} />
      </Card>

      {categoryTotals.length > 0 && (
        <Card className="!p-5">
          <h2 className="mb-4 text-[17px] font-bold">Spending by category</h2>
          <TopCategoriesList data={topCategories} total={totalSpent} />
          <div className="mt-3">
            <CategoryPieChart data={categoryTotals} />
          </div>
        </Card>
      )}

      <div>
        <SectionHeader title="Recent transactions" href="/expenses" />
        <RecentTransactions expenses={monthExpenses} />
      </div>

      {budgetProgress.length > 0 && (
        <div>
          <SectionHeader title="Budget progress" href="/budgets" />
          <Card className="!p-5">
            <div className="flex flex-col gap-4">
              {budgetProgress.map((b) => {
                const over = b.spent > b.limit;
                return (
                  <div key={b.category} className="flex items-center gap-3">
                    <CategoryIcon category={b.category} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">{b.category}</span>
                        <span className="text-muted">
                          {formatINR(b.spent)} / {formatINR(b.limit)}
                        </span>
                      </div>
                      <ProgressBar
                        className="mt-1.5"
                        pct={b.pct}
                        color={over ? "rgb(var(--expense))" : "rgb(var(--accent))"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {goals.length > 0 && (
        <div>
          <SectionHeader title="Goals" href="/goals" />
          <Card className="!p-5">
            <div className="flex flex-col gap-4">
              {goals.slice(0, 2).map((g) => {
                const pct = g.target > 0 ? (g.saved / g.target) * 100 : 0;
                return (
                  <div key={g.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{g.name}</span>
                      <span className="text-muted">
                        {formatINR(g.saved)} / {formatINR(g.target)}
                      </span>
                    </div>
                    <ProgressBar className="mt-1.5" pct={pct} color="rgb(var(--savings))" />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      <div>
        <h2 className="mb-3 px-1 text-[17px] font-bold">Bill reminders</h2>
        <ReminderSection reminders={reminders} />
      </div>
    </div>
  );
}
