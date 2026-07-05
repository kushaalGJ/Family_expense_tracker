import { CATEGORY_META } from "@/lib/constants/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { formatINR } from "@/lib/utils/currency";
import type { Category } from "@/lib/types/database.types";

export function TopCategoriesList({
  data,
  total,
}: {
  data: { category: Category; amount: number }[];
  total: number;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-muted">Nothing to rank yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((c) => {
        const pct = total > 0 ? Math.round((c.amount / total) * 100) : 0;
        return (
          <div key={c.category} className="flex items-center gap-3">
            <CategoryIcon category={c.category} size={38} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{c.category}</span>
                <span className="text-muted">{formatINR(c.amount)}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: CATEGORY_META[c.category].color }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
