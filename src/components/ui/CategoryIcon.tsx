import { CATEGORY_META } from "@/lib/constants/categories";
import { CATEGORY_ICON } from "@/lib/constants/categoryIcons";
import type { Category } from "@/lib/types/database.types";

export function CategoryIcon({
  category,
  size = 44,
}: {
  category: Category;
  size?: number;
}) {
  const color = CATEGORY_META[category].color;
  const Icon = CATEGORY_ICON[category];
  return (
    <span
      className="chip flex shrink-0 items-center justify-center rounded-2xl"
      style={{ ["--chip" as string]: color, width: size, height: size }}
    >
      <Icon size={size * 0.5} strokeWidth={2} />
    </span>
  );
}
