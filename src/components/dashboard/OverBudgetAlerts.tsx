import { AlertTriangle } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import type { Category } from "@/lib/types/database.types";

export function OverBudgetAlerts({
  items,
}: {
  items: { category: Category; limit: number; spent: number }[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.category}
          className="flex items-center gap-2.5 rounded-2xl border border-[rgb(var(--expense))]/25 bg-[rgb(var(--expense))]/10 px-3.5 py-3 text-sm text-[rgb(var(--expense))]"
        >
          <AlertTriangle size={18} className="shrink-0" />
          <span>
            {formatINR(item.spent - item.limit)} over budget on{" "}
            <span className="font-semibold">{item.category}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
