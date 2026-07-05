"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGoal, updateGoal } from "@/lib/actions/goals";
import { initialActionState } from "@/lib/actions/shared";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { Database } from "@/lib/types/database.types";

type Goal = Database["public"]["Tables"]["goals"]["Row"];

export function GoalEditModal({
  open,
  onClose,
  goal,
}: {
  open: boolean;
  onClose: () => void;
  goal?: Goal;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setPending(true);
    if (goal) formData.set("id", goal.id);
    const action = goal ? updateGoal : createGoal;
    const result = await action(initialActionState, formData);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    onClose();
    router.refresh();
  }

  return (
    <Modal open={open} onClose={onClose} title={goal ? "Edit Goal" : "New Goal"}>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Goal name"
          name="name"
          defaultValue={goal?.name}
          required
          autoFocus
          placeholder="Emergency fund"
        />
        <FormField
          label="Target (₹)"
          name="target"
          type="number"
          step="1"
          min="0"
          defaultValue={goal?.target}
          required
        />
        <FormField
          label="Saved so far (₹)"
          name="saved"
          type="number"
          step="1"
          min="0"
          defaultValue={goal?.saved ?? 0}
        />
        <FormField
          label="Deadline (optional)"
          name="deadline"
          type="date"
          defaultValue={goal?.deadline ?? undefined}
        />
        {error && <p className="text-sm text-[rgb(var(--expense))]">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </form>
    </Modal>
  );
}
