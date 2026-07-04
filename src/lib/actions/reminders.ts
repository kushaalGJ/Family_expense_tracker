"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types/database.types";
import type { ActionState } from "@/lib/actions/shared";

export async function listReminders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .order("due_day", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createReminder(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const title = String(formData.get("title") || "").trim();
  const amount = Number(formData.get("amount"));
  const dueDay = Number(formData.get("dueDay"));
  const category = String(formData.get("category") || "") as Category;

  if (!title || !amount || amount <= 0 || !dueDay || dueDay < 1 || dueDay > 28 || !category) {
    return { error: "Please fill in all fields (due day must be 1-28)." };
  }

  const { error } = await supabase.from("reminders").insert({
    user_id: user.id,
    title,
    amount,
    due_day: dueDay,
    category,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteReminder(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");

  const { error } = await supabase.from("reminders").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/dashboard");
}
