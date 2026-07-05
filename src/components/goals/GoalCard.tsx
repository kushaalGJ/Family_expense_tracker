"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Pencil, Trash2 } from "lucide-react";
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
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="chip flex h-8 w-8 items-center justify-center rounded-xl" style={{ ["--chip" as string]: "rgb(var(--accent))" }}>
              <Trophy size={16} />
            </span>
            {goal.name}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="cursor-pointer text-muted hover:text-foreground"
              aria-label="Edit goal"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="cursor-pointer text-muted hover:text-[rgb(var(--expense))]"
              aria-label="Delete goal"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-[rgb(var(--accent))]"
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-muted">
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
