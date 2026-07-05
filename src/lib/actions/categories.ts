"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getFamilyId } from "@/lib/mode";
import type { Database } from "@/lib/types/database.types";

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export async function listCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const familyId = await getFamilyId(supabase, user.id);
  // Own categories plus family-shared ones.
  const query = supabase.from("categories").select("*").order("created_at", { ascending: true });
  const { data, error } = familyId
    ? await query.or(`user_id.eq.${user.id},family_id.eq.${familyId}`)
    : await query.eq("user_id", user.id);
  if (error) throw error;
  return data ?? [];
}

export async function createCategory(name: string, icon: string, color: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");

  const familyId = await getFamilyId(supabase, user.id);
  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    family_id: familyId,
    name: name.trim(),
    icon,
    color,
  });
  if (error) throw error;
  revalidatePath("/budgets");
  revalidatePath("/expenses");
}

export async function updateCategory(id: string, name: string, icon: string, color: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim(), icon, color })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/budgets");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/budgets");
}
