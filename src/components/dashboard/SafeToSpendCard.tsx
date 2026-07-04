import Link from "next/link";
import { formatINR } from "@/lib/utils/currency";

export function SafeToSpendCard({
  safeToSpend,
  totalIncome,
  totalSpent,
}: {
  safeToSpend: number;
  totalIncome: number;
  totalSpent: number;
}) {
  const isNegative = safeToSpend < 0;

  return (
    <div className="glass-card p-5 text-center">
      <div className="text-sm text-foreground/60">Safe to spend</div>
      <div
        className={`mt-1 text-3xl font-bold ${
          isNegative ? "text-red-400" : "text-[rgb(var(--accent))]"
        }`}
      >
        {formatINR(safeToSpend)}
      </div>
      <div className="mt-3 flex justify-center gap-6 text-sm text-foreground/60">
        <span>Spent: {formatINR(totalSpent)}</span>
        <span>Income: {formatINR(totalIncome)}</span>
      </div>
      <Link
        href="/budgets"
        className="mt-3 inline-block text-xs text-[rgb(var(--accent))] hover:underline"
      >
        Edit budget limits to change this →
      </Link>
    </div>
  );
}
