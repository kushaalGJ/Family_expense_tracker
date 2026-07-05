import { createClient } from "@/lib/supabase/server";
import { resolveModeContext } from "@/lib/mode";
import { listExpenses } from "@/lib/actions/expenses";
import { listIncome } from "@/lib/actions/income";
import { getFamilyLeaderboard } from "@/lib/actions/family";
import { getMonthRange, toISODate } from "@/lib/utils/dates";
import { formatINR } from "@/lib/utils/currency";
import { categoryColor } from "@/lib/constants/categories";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PeriodToggle } from "@/components/reports/PeriodToggle";
import { ExportButtons } from "@/components/reports/ExportButtons";

function rangeFor(period: string): { start: string; end: string; label: string } {
  const now = new Date();
  if (period === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    return { start: toISODate(start), end: toISODate(now), label: "Last 7 days" };
  }
  if (period === "year") {
    return {
      start: `${now.getFullYear()}-01-01`,
      end: `${now.getFullYear()}-12-31`,
      label: `${now.getFullYear()}`,
    };
  }
  const m = getMonthRange(now);
  return { ...m, label: now.toLocaleDateString("en-IN", { month: "long", year: "numeric" }) };
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "month" } = await searchParams;
  const { start, end, label } = rangeFor(period);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const modeCtx = user ? await resolveModeContext(supabase, user) : null;

  const [expenses, income] = await Promise.all([
    listExpenses({ dateFrom: start, dateTo: end }),
    listIncome(start, end),
  ]);

  const familyLeaderboard =
    period === "month" && modeCtx?.mode === "family" && modeCtx.familyId
      ? await getFamilyLeaderboard(modeCtx.familyId)
      : [];

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const savings = totalIncome - totalExpense;

  const byCategory = new Map<string, number>();
  for (const e of expenses) byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
  const categories = [...byCategory.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const familyTotal = familyLeaderboard.reduce((s, m) => s + m.total, 0);

  const stats = [
    { label: "Income", value: totalIncome, color: "rgb(var(--income))" },
    { label: "Expense", value: totalExpense, color: "rgb(var(--expense))" },
    { label: "Savings", value: savings, color: "rgb(var(--savings))" },
  ];

  return (
    <div className="flex flex-col gap-5 pt-1">
      <h1 className="text-2xl font-bold">Reports</h1>
      <PeriodToggle active={period} />

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card !rounded-2xl p-4 text-center">
            <div className="text-xs font-medium text-muted">{s.label}</div>
            <div className="mt-1 text-base font-extrabold" style={{ color: s.color }}>
              {formatINR(s.value)}
            </div>
          </div>
        ))}
      </div>

      <Card className="!p-5">
        <h2 className="mb-4 text-[17px] font-bold">Category breakdown</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-muted">No expenses in this period.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {categories.map((c) => (
              <div key={c.category} className="flex items-center gap-3">
                <CategoryIcon category={c.category} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{c.category}</span>
                    <span className="text-muted">
                      {formatINR(c.amount)} · {totalExpense > 0 ? Math.round((c.amount / totalExpense) * 100) : 0}%
                    </span>
                  </div>
                  <ProgressBar
                    className="mt-1.5"
                    pct={totalExpense > 0 ? (c.amount / totalExpense) * 100 : 0}
                    color={categoryColor(c.category)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {familyLeaderboard.length > 0 && (
        <Card className="!p-5">
          <h2 className="mb-4 text-[17px] font-bold">Family contribution</h2>
          <div className="flex flex-col gap-4">
            {familyLeaderboard.map((m) => (
              <div key={m.user_id} className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-2xl text-lg"
                  style={{ backgroundColor: `${m.color}22` }}
                >
                  {m.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-muted">
                      {formatINR(m.total)} · {familyTotal > 0 ? Math.round((m.total / familyTotal) * 100) : 0}%
                    </span>
                  </div>
                  <ProgressBar
                    className="mt-1.5"
                    pct={familyTotal > 0 ? (m.total / familyTotal) * 100 : 0}
                    color={m.color}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div>
        <h2 className="mb-3 px-1 text-[17px] font-bold">Export {label}</h2>
        <ExportButtons rows={expenses} label={label} />
      </div>
    </div>
  );
}
