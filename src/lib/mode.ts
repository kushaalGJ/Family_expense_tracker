import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";
import type { Profile, ModeContextValue } from "@/lib/types/domain";

/** Resolves whether a user is in family or private mode, and their profile. */
export async function resolveModeContext(
  supabase: SupabaseClient<Database>,
  user: User
): Promise<ModeContextValue> {
  const { data: membership } = await supabase
    .from("family_members")
    .select("family_id, name, emoji, color")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    const meta = (user.user_metadata ?? {}) as Partial<Profile>;
    return {
      mode: "private",
      familyId: null,
      familyName: null,
      familyCode: null,
      profile: {
        name: meta.name ?? "You",
        emoji: meta.emoji ?? "🙂",
        color: meta.color ?? "#8B5CF6",
      },
      userId: user.id,
    };
  }

  const { data: family } = await supabase
    .from("families")
    .select("name, code")
    .eq("id", membership.family_id)
    .maybeSingle();

  return {
    mode: "family",
    familyId: membership.family_id,
    familyName: family?.name ?? null,
    familyCode: family?.code ?? null,
    profile: { name: membership.name, emoji: membership.emoji, color: membership.color },
    userId: user.id,
  };
}

/** Lightweight lookup used by write Server Actions to re-derive family_id server-side. */
export async function getFamilyId(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.family_id ?? null;
}
