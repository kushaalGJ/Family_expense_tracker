import { TrendingDown, TrendingUp } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";

export function SafeToSpendCard({
  safeToSpend,
  totalIncome,
  totalSpent,
  totalBudget,
  prevSpent,
}: {
  safeToSpend: number;
  totalIncome: number;
  totalSpent: number;
  totalBudget: number;
  prevSpent: number;
}) {
  const isNegative = safeToSpend < 0;
  const usedPct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const over = totalBudget > 0 && totalSpent > totalBudget;

  const pctChange =
    prevSpent > 0 ? Math.round(((totalSpent - prevSpent) / prevSpent) * 100) : null;
  const spentMore = pctChange !== null && pctChange > 0;

  return (
    <div className="card p-5">
      <div className="text-sm text-muted">Safe to spend this month</div>
      <div
        className={`mt-1 text-4xl font-bold tracking-tight ${
          isNegative ? "text-[rgb(var(--expense))]" : ""
        }`}
      >
        {formatINR(safeToSpend)}
      </div>

      {pctChange !== null && (
        <div
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            spentMore
              ? "bg-[rgb(var(--expense))]/12 text-[rgb(var(--expense))]"
              : "bg-[rgb(var(--income))]/12 text-[rgb(var(--income))]"
          }`}
        >
          {spentMore ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(pctChange)}% {spentMore ? "more" : "less"} spent than last month
        </div>
      )}

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div
          className="h-full rounded-full"
          style={{
            width: `${usedPct}%`,
            background: over ? "rgb(var(--expense))" : "rgb(var(--accent))",
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted">
          <span className="h-2 w-2 rounded-full bg-[rgb(var(--expense))]" />
          Spent <span className="font-medium text-foreground">{formatINR(totalSpent)}</span>
        </span>
        <span className="flex items-center gap-1.5 text-muted">
          <span className="h-2 w-2 rounded-full bg-[rgb(var(--income))]" />
          Income <span className="font-medium text-foreground">{formatINR(totalIncome)}</span>
        </span>
      </div>
    </div>
  );
}
