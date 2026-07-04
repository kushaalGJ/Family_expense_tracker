"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGoal } from "@/lib/actions/goals";
import { GoalEditModal } from "@/components/goals/GoalEditModal";
import { formatINR } from "@/lib/utils/currency";
import type { Database } from "@/lib/types/database.types";

type Goal = Database["public"]["Tables"]["goals"]["Row"];

export function GoalCard({ goal }: { goal: Goal }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pct = goal.target > 0 ? Math.min(goal.saved / goal.target, 1) : 0;

  async function handleDelete() {
    await deleteGoal(goal.id);
    router.refresh();
  }

  // Appending a local time component avoids the UTC-midnight parsing that
  // would otherwise shift the displayed date back a day in negative-offset timezones.
  const deadlineLabel = goal.deadline
    ? new Date(`${goal.deadline}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <>
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">🏆 {goal.name}</div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="cursor-pointer text-foreground/50 hover:text-foreground"
              aria-label="Edit goal"
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="cursor-pointer text-foreground/50 hover:text-red-400"
              aria-label="Delete goal"
            >
              🗑️
            </button>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[rgb(var(--accent))]"
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-foreground/60">
          <span>
            {formatINR(goal.saved)} / {formatINR(goal.target)}
          </span>
          {deadlineLabel && <span>by {deadlineLabel}</span>}
        </div>
      </div>
      <GoalEditModal open={open} onClose={() => setOpen(false)} goal={goal} />
    </>
  );
}
