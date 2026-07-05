"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteGoal } from "@/lib/actions/goals";
import { GoalEditModal } from "@/components/goals/GoalEditModal";
import { BudgetRing } from "@/components/budgets/BudgetRing";
import { formatINR } from "@/lib/utils/currency";
import { daysUntil } from "@/lib/utils/dates";
import type { Database } from "@/lib/types/database.types";

type Goal = Database["public"]["Tables"]["goals"]["Row"];

function motivation(pct: number): string {
  if (pct >= 100) return "Goal reached! 🎉";
  if (pct >= 75) return "Almost there — keep going!";
  if (pct >= 50) return "Halfway there!";
  if (pct >= 25) return "Great start!";
  return "Let's get saving!";
}

export function GoalCard({ goal }: { goal: Goal }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pct = goal.target > 0 ? Math.min((goal.saved / goal.target) * 100, 100) : 0;
  const days = goal.deadline ? daysUntil(goal.deadline) : null;

  async function handleDelete() {
    await deleteGoal(goal.id);
    router.refresh();
  }

  return (
    <>
      <div className="card p-5">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <BudgetRing
              spent={goal.saved}
              limit={goal.target}
              color="rgb(var(--savings))"
              overColor="rgb(var(--savings))"
              size={76}
              strokeWidth={8}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold">
              {Math.round(pct)}%
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-lg font-bold">{goal.name}</span>
              <span className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="text-muted hover:text-foreground"
                  aria-label="Edit goal"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-muted hover:text-[rgb(var(--expense))]"
                  aria-label="Delete goal"
                >
                  <Trash2 size={16} />
                </button>
              </span>
            </div>
            <div className="mt-0.5 text-sm">
              <span className="font-bold text-[rgb(var(--savings))]">{formatINR(goal.saved)}</span>
              <span className="text-muted"> / {formatINR(goal.target)}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted">
              <span>{motivation(pct)}</span>
              {days !== null && (
                <>
                  <span>·</span>
                  <span>{days >= 0 ? `${days} days left` : `${Math.abs(days)} days over`}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <GoalEditModal open={open} onClose={() => setOpen(false)} goal={goal} />
    </>
  );
}
