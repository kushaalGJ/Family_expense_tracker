import { Trophy } from "lucide-react";
import { listGoals } from "@/lib/actions/goals";
import { formatINR } from "@/lib/utils/currency";
import { GoalCard } from "@/components/goals/GoalCard";
import { NewGoalButton } from "@/components/goals/NewGoalButton";

export default async function GoalsPage() {
  const goals = await listGoals();
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  return (
    <div className="flex flex-col gap-5 pt-1">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Goals</h1>
        <NewGoalButton />
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(var(--savings))]/12 text-[rgb(var(--savings))]">
            <Trophy size={34} strokeWidth={1.6} />
          </span>
          <div className="text-lg font-bold">No goals yet</div>
          <p className="max-w-[220px] text-sm text-muted">
            Set a savings goal and watch your progress grow.
          </p>
        </div>
      ) : (
        <>
          <div className="card !border-0 p-5 text-white" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}>
            <div className="text-sm font-medium text-white/80">Total saved</div>
            <div className="mt-1 text-3xl font-extrabold">{formatINR(totalSaved)}</div>
            <div className="text-sm text-white/80">of {formatINR(totalTarget)} across {goals.length} goal{goals.length === 1 ? "" : "s"}</div>
          </div>
          <div className="flex flex-col gap-3">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
