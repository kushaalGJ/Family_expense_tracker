"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/actions/shared";

/** Lets an already-logged-in user (e.g. a private account) join a family by
 *  code, reusing their saved profile. Uses the existing join RPC. */
export async function joinExistingUserToFamily(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const code = String(formData.get("code") || "").trim().toUpperCase();
  if (!code) return { error: "Enter a join code." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const meta = (user.user_metadata ?? {}) as { name?: string; emoji?: string; color?: string };
  const { error } = await supabase.rpc("join_family_by_code", {
    join_code: code,
    member_name: meta.name ?? "Me",
    member_emoji: meta.emoji ?? "🙂",
    member_color: meta.color ?? "#1DB954",
  });
  if (error) {
    return {
      error: error.message.includes("INVALID_CODE")
        ? "That code doesn't match any family."
        : error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/family");
}

function readProfileFields(formData: FormData) {
  return {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
    name: String(formData.get("name") || "").trim(),
    emoji: String(formData.get("emoji") || "🙂"),
    color: String(formData.get("color") || "#8B5CF6"),
  };
}

export async function createFamilyAccount(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { email, password, name, emoji, color } = readProfileFields(formData);
  const familyName = String(formData.get("familyName") || "").trim();

  if (!email || !password || !name || !familyName) {
    return { error: "Please fill in all fields." };
  }

  const supabase = await createClient();
  const { error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) return { error: signUpError.message };

  const { error: rpcError } = await supabase.rpc("create_family_with_owner", {
    family_name: familyName,
    owner_name: name,
    owner_emoji: emoji,
    owner_color: color,
  });
  if (rpcError) return { error: rpcError.message };

  redirect("/dashboard");
}

export async function joinFamilyAccount(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { email, password, name, emoji, color } = readProfileFields(formData);
  const code = String(formData.get("code") || "").trim().toUpperCase();

  if (!email || !password || !name || !code) {
    return { error: "Please fill in all fields." };
  }

  const supabase = await createClient();
  // New user: sign up. Existing account (e.g. a private account): the sign-up
  // fails, so sign them in instead so they can join with the same login.
  const { error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      return {
        error:
          "An account with this email already exists. Enter its correct password to log in and join.",
      };
    }
  }

  const { error: rpcError } = await supabase.rpc("join_family_by_code", {
    join_code: code,
    member_name: name,
    member_emoji: emoji,
    member_color: color,
  });
  if (rpcError) {
    if (rpcError.message.includes("INVALID_CODE")) {
      return { error: "That code doesn't match any family. Double-check and try again." };
    }
    return { error: rpcError.message };
  }

  redirect("/dashboard");
}

export async function createPrivateAccount(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { email, password, name, emoji, color } = readProfileFields(formData);

  if (!email || !password || !name) {
    return { error: "Please fill in all fields." };
  }

  const supabase = await createClient();
  const { error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) return { error: signUpError.message };

  const { error: updateError } = await supabase.auth.updateUser({
    data: { name, emoji, color },
  });
  if (updateError) return { error: updateError.message };

  redirect("/dashboard");
}

export async function login(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/entry");
}

export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entry");

  const { error } = await supabase.rpc("delete_current_user");
  if (error) throw error;

  await supabase.auth.signOut();
  redirect("/entry");
}
