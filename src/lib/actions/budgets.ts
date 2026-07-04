"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getFamilyId } from "@/lib/mode";
import type { Category } from "@/lib/types/database.types";

export async function listBudgets() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.from("budgets").select("*").eq("user_id", user.id);
  if (error) throw error;
  return data ?? [];
}

export async function upsertBudget(category: Category, monthlyLimit: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");

  const familyId = await getFamilyId(supabase, user.id);

  // Postgres treats NULL <> NULL, so a plain upsert's onConflict target can't
  // match existing private-mode rows (family_id always null there) — check
  // for an existing row explicitly instead of relying on ON CONFLICT.
  let existingQuery = supabase
    .from("budgets")
    .select("id")
    .eq("user_id", user.id)
    .eq("category", category);
  existingQuery = familyId
    ? existingQuery.eq("family_id", familyId)
    : existingQuery.is("family_id", null);
  const { data: existing } = await existingQuery.maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("budgets")
      .update({ monthly_limit: monthlyLimit })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("budgets").insert({
      user_id: user.id,
      family_id: familyId,
      category,
      monthly_limit: monthlyLimit,
    });
    if (error) throw error;
  }

  revalidatePath("/dashboard");
  revalidatePath("/budgets");
}
