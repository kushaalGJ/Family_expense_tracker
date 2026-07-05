"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { GoalEditModal } from "@/components/goals/GoalEditModal";
import { Button } from "@/components/ui/Button";

export function NewGoalButton() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setOpen(true);
      router.replace("/goals");
    }
  }, [searchParams, router]);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <Plus size={16} /> New goal
      </Button>
      <GoalEditModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
