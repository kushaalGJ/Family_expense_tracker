import { CATEGORY_META } from "@/lib/constants/categories";
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
          className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {CATEGORY_META[item.category].emoji} You&apos;re {formatINR(item.spent - item.limit)} over
          budget on {item.category}
        </div>
      ))}
    </div>
  );
}
