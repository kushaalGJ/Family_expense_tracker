"use server";

import { createClient } from "@/lib/supabase/server";
import { getMonthRange } from "@/lib/utils/dates";
import type { Category } from "@/lib/types/database.types";

export type LeaderboardMember = {
  user_id: string;
  name: string;
  emoji: string;
  color: string;
  total: number;
  topCategories: { category: Category; amount: number }[];
};

export async function getFamilyLeaderboard(familyId: string): Promise<LeaderboardMember[]> {
  const supabase = await createClient();
  const { start, end } = getMonthRange();

  const [{ data: members }, { data: expenses }] = await Promise.all([
    supabase.from("family_members").select("*").eq("family_id", familyId),
    supabase
      .from("expenses")
      .select("user_id, amount, category")
      .eq("family_id", familyId)
      .gte("date", start)
      .lte("date", end),
  ]);

  const totals = new Map<string, number>();
  const byCategory = new Map<string, Map<Category, number>>();

  for (const e of expenses ?? []) {
    totals.set(e.user_id, (totals.get(e.user_id) ?? 0) + e.amount);
    if (!byCategory.has(e.user_id)) byCategory.set(e.user_id, new Map());
    const catMap = byCategory.get(e.user_id)!;
    catMap.set(e.category, (catMap.get(e.category) ?? 0) + e.amount);
  }

  return (members ?? [])
    .map((m) => ({
      user_id: m.user_id,
      name: m.name,
      emoji: m.emoji,
      color: m.color,
      total: totals.get(m.user_id) ?? 0,
      topCategories: Array.from(byCategory.get(m.user_id)?.entries() ?? [])
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3),
    }))
    .sort((a, b) => b.total - a.total);
}
