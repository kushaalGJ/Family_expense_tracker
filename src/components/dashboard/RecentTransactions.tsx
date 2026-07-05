import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { formatINR } from "@/lib/utils/currency";
import { todayISODate } from "@/lib/utils/dates";
import type { Database } from "@/lib/types/database.types";

type Expense = Database["public"]["Tables"]["expenses"]["Row"];

function dayLabel(dateStr: string): string {
  const today = todayISODate();
  if (dateStr === today) return "Today";
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yISO = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(
    y.getDate()
  ).padStart(2, "0")}`;
  if (dateStr === yISO) return "Yesterday";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function RecentTransactions({ expenses }: { expenses: Expense[] }) {
  const recent = expenses.slice(0, 6);

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recent transactions</h2>
        <Link href="/expenses" className="flex items-center text-xs font-medium text-[rgb(var(--accent))]">
          See all <ChevronRight size={14} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted">No transactions yet.</p>
      ) : (
        <div className="flex flex-col">
          {recent.map((e, i) => (
            <div
              key={e.id}
              className={`flex items-center gap-3 py-2.5 ${
                i > 0 ? "border-t border-black/5 dark:border-white/5" : ""
              }`}
            >
              <CategoryIcon category={e.category} size={40} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{e.note || e.category}</div>
                <div className="text-xs text-muted">
                  {dayLabel(e.date)} · {e.category}
                </div>
              </div>
              <div className="text-sm font-semibold text-[rgb(var(--expense))]">
                −{formatINR(e.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
