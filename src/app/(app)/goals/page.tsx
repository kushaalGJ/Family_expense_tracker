import { listGoals } from "@/lib/actions/goals";
import { GoalCard } from "@/components/goals/GoalCard";
import { NewGoalButton } from "@/components/goals/NewGoalButton";

export default async function GoalsPage() {
  const goals = await listGoals();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Goals</h1>
        <NewGoalButton />
      </div>
      {goals.length === 0 ? (
        <p className="text-sm text-muted">
          No savings goals yet. Add one to start tracking progress.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
