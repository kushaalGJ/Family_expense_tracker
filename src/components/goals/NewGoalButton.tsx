"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { GoalEditModal } from "@/components/goals/GoalEditModal";
import { Button } from "@/components/ui/Button";

export function NewGoalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <Plus size={16} /> New goal
      </Button>
      <GoalEditModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
