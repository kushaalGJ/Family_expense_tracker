"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/actions/shared";

export async function listIncome(dateFrom: string, dateTo: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("income")
    .select("*")
    .gte("date", dateFrom)
    .lte("date", dateTo)
    .order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createIncome(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const amount = Number(formData.get("amount"));
  const source = String(formData.get("source") || "").trim();
  const date = String(formData.get("date") || "");

  if (!amount || amount <= 0 || !date) {
    return { error: "Please fill in amount and date." };
  }

  const { error } = await supabase.from("income").insert({
    user_id: user.id,
    family_id: null,
    amount,
    source,
    date,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}
