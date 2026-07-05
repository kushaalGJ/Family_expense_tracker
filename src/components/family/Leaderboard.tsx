import { categoryEmoji } from "@/lib/constants/categories";
import { formatINR } from "@/lib/utils/currency";
import type { LeaderboardMember } from "@/lib/actions/family";

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard({
  members,
  currentUserId,
}: {
  members: LeaderboardMember[];
  currentUserId: string;
}) {
  if (members.length === 0) {
    return <p className="text-sm text-muted">No family members yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {members.map((member, index) => (
        <div key={member.user_id} className="card p-3">
          <div className="flex items-center gap-3">
            <span className="w-5 text-center text-sm">{RANK_MEDALS[index] ?? index + 1}</span>
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
              style={{ backgroundColor: `${member.color}33` }}
            >
              {member.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {member.name}
                {member.user_id === currentUserId && (
                  <span className="ml-1 text-xs text-muted">(you)</span>
                )}
              </div>
              {member.topCategories.length > 0 && (
                <div className="mt-0.5 flex gap-2 text-xs text-muted">
                  {member.topCategories.map((c) => (
                    <span key={c.category}>
                      {categoryEmoji(c.category)} {formatINR(c.amount)}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="font-semibold">{formatINR(member.total)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
