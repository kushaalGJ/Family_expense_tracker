import { CATEGORY_META } from "@/lib/constants/categories";
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
    return <p className="text-sm text-foreground/50">Nothing to rank yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((c) => (
        <div key={c.category} className="flex items-center justify-between text-sm">
          <span>
            {CATEGORY_META[c.category].emoji} {c.category}
          </span>
          <span className="text-foreground/60">
            {formatINR(c.amount)} · {total > 0 ? Math.round((c.amount / total) * 100) : 0}%
          </span>
        </div>
      ))}
    </div>
  );
}
