import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { resolveModeContext } from "@/lib/mode";
import { getFamilyLeaderboard } from "@/lib/actions/family";
import { formatINR } from "@/lib/utils/currency";
import { categoryColor } from "@/lib/constants/categories";
import { JoinCodeCard } from "@/components/family/JoinCodeCard";
import { JoinFamilyInline } from "@/components/family/JoinFamilyInline";

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function FamilyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entry");

  const modeCtx = await resolveModeContext(supabase, user);

  if (modeCtx.mode !== "family" || !modeCtx.familyId) {
    return (
      <div className="flex flex-col gap-4 pt-1">
        <h1 className="text-2xl font-bold">Family</h1>
        <JoinFamilyInline />
      </div>
    );
  }

  const leaderboard = await getFamilyLeaderboard(modeCtx.familyId);
  const familyTotal = leaderboard.reduce((s, m) => s + m.total, 0);

  return (
    <div className="flex flex-col gap-5 pt-1">
      <h1 className="text-2xl font-bold">Family</h1>

      <div className="card gradient-accent !border-0 p-5 text-white">
        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
          <Users size={16} /> {modeCtx.familyName} · {leaderboard.length} member
          {leaderboard.length === 1 ? "" : "s"}
        </div>
        <div className="mt-1 text-3xl font-extrabold">{formatINR(familyTotal)}</div>
        <div className="text-sm text-white/80">spent together this month</div>
      </div>

      <JoinCodeCard familyName={modeCtx.familyName ?? "Your family"} code={modeCtx.familyCode ?? ""} />

      <div>
        <h2 className="mb-3 px-1 text-[17px] font-bold">Members</h2>
        <div className="flex flex-col gap-3">
          {leaderboard.map((m, i) => {
            const contribution = familyTotal > 0 ? Math.round((m.total / familyTotal) * 100) : 0;
            return (
              <div key={m.user_id} className="card p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                    style={{ backgroundColor: `${m.color}22` }}
                  >
                    {m.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      {m.name}
                      {m.user_id === user.id && (
                        <span className="text-xs font-medium text-muted">(you)</span>
                      )}
                      <span className="ml-auto text-base">{MEDALS[i] ?? ""}</span>
                    </div>
                    <div className="text-xs text-muted">{contribution}% of family spending</div>
                  </div>
                  <div className="text-lg font-extrabold">{formatINR(m.total)}</div>
                </div>

                {m.topCategories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.topCategories.map((c) => (
                      <span
                        key={c.category}
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{
                          background: `${categoryColor(c.category)}18`,
                          color: categoryColor(c.category),
                        }}
                      >
                        {c.category} {formatINR(c.amount)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
