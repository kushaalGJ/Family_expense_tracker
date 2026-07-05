import { categoryColor } from "@/lib/constants/categories";
import { categoryIconFor } from "@/lib/constants/categoryIcons";

export function CategoryIcon({
  category,
  color,
  icon,
  size = 44,
}: {
  category: string;
  color?: string;
  icon?: string | null;
  size?: number;
}) {
  const resolvedColor = color ?? categoryColor(category);
  const Icon = categoryIconFor(category, icon);
  return (
    <span
      className="chip flex shrink-0 items-center justify-center rounded-2xl"
      style={{ ["--chip" as string]: resolvedColor, width: size, height: size }}
    >
      <Icon size={size * 0.46} strokeWidth={2} />
    </span>
  );
}
