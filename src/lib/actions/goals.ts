"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/actions/shared";

export async function listGoals() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

function readGoalFields(formData: FormData) {
  return {
    name: String(formData.get("name") || "").trim(),
    target: Number(formData.get("target")),
    saved: Number(formData.get("saved") || 0),
    deadline: String(formData.get("deadline") || "") || null,
  };
}

export async function createGoal(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const { name, target, saved, deadline } = readGoalFields(formData);
  if (!name || !target || target <= 0) {
    return { error: "Please enter a name and target amount." };
  }

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    name,
    target,
    saved,
    deadline,
  });
  if (error) return { error: error.message };

  revalidatePath("/goals");
  return { error: null };
}

export async function updateGoal(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const id = String(formData.get("id") || "");
  const { name, target, saved, deadline } = readGoalFields(formData);
  if (!id || !name || !target || target <= 0) {
    return { error: "Please enter a name and target amount." };
  }

  const { error } = await supabase
    .from("goals")
    .update({ name, target, saved, deadline })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/goals");
  return { error: null };
}

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");

  const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/goals");
}
