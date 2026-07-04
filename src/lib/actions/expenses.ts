"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFamilyId } from "@/lib/mode";
import type { Category } from "@/lib/types/database.types";
import type { ActionState } from "@/lib/actions/shared";

export type ExpenseFilters = {
  search?: string;
  category?: Category;
  dateFrom?: string;
  dateTo?: string;
};

export async function listExpenses(filters: ExpenseFilters = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.dateFrom) query = query.gte("date", filters.dateFrom);
  if (filters.dateTo) query = query.lte("date", filters.dateTo);
  if (filters.search) query = query.ilike("note", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createExpense(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const amount = Number(formData.get("amount"));
  const category = String(formData.get("category") || "") as Category;
  const note = String(formData.get("note") || "").trim();
  const date = String(formData.get("date") || "");
  const isShared = formData.get("isShared") === "on";
  const isRecurring = formData.get("isRecurring") === "on";

  if (!amount || amount <= 0 || !category || !date) {
    return { error: "Please fill in amount, category, and date." };
  }

  const familyId = isShared ? await getFamilyId(supabase, user.id) : null;

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    family_id: familyId,
    amount,
    category,
    note,
    date,
    is_shared: Boolean(familyId),
    is_recurring: isRecurring,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  redirect("/expenses");
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
}
