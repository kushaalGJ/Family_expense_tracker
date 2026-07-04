import { CATEGORIES, CATEGORY_META } from "@/lib/constants/categories";

export function CategorySelect({
  name,
  defaultValue,
  className = "",
}: {
  name: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground/80">Category</span>
      <select
        name={name}
        defaultValue={defaultValue ?? CATEGORIES[0]}
        className={`glass-card w-full rounded-2xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] ${className}`}
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORY_META[cat].emoji} {cat}
          </option>
        ))}
      </select>
    </label>
  );
}
