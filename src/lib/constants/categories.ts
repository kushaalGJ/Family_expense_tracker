import type { Category } from "@/lib/types/database.types";

export const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Education",
  "Other",
];

export const CATEGORY_META: Record<Category, { color: string; emoji: string }> = {
  Food: { color: "#F97316", emoji: "🍔" },
  Transport: { color: "#3B82F6", emoji: "🚗" },
  Shopping: { color: "#EC4899", emoji: "🛍️" },
  Bills: { color: "#EF4444", emoji: "🧾" },
  Health: { color: "#10B981", emoji: "💊" },
  Entertainment: { color: "#8B5CF6", emoji: "🎬" },
  Education: { color: "#06B6D4", emoji: "📚" },
  Other: { color: "#6B7280", emoji: "📦" },
};

export const DEFAULT_CATEGORY = { color: "#6B7280", emoji: "🏷️" };

/** Color for any category name — built-in or custom (falls back to neutral gray). */
export function categoryColor(name: string): string {
  return (CATEGORY_META as Record<string, { color: string; emoji: string }>)[name]?.color ?? DEFAULT_CATEGORY.color;
}

/** Emoji for any category name — built-in or custom. */
export function categoryEmoji(name: string): string {
  return (CATEGORY_META as Record<string, { color: string; emoji: string }>)[name]?.emoji ?? DEFAULT_CATEGORY.emoji;
}

export const DEFAULT_BUDGETS: Record<Category, number> = {
  Food: 5000,
  Transport: 2000,
  Shopping: 3000,
  Bills: 4000,
  Health: 2000,
  Entertainment: 1500,
  Education: 2000,
  Other: 1000,
};
