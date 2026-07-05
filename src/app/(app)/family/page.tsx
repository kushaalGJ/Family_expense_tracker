import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveModeContext } from "@/lib/mode";
import { getFamilyLeaderboard } from "@/lib/actions/family";
import { JoinCodeCard } from "@/components/family/JoinCodeCard";
import { Leaderboard } from "@/components/family/Leaderboard";

export default async function FamilyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entry");

  const modeCtx = await resolveModeContext(supabase, user);
  if (modeCtx.mode !== "family" || !modeCtx.familyId) redirect("/dashboard");

  const leaderboard = await getFamilyLeaderboard(modeCtx.familyId);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Family</h1>
      <JoinCodeCard familyName={modeCtx.familyName ?? "Your family"} code={modeCtx.familyCode ?? ""} />
      <div>
        <h2 className="mb-2 text-sm font-semibold">This month&apos;s leaderboard</h2>
        <Leaderboard members={leaderboard} currentUserId={user.id} />
      </div>
    </div>
  );
}
