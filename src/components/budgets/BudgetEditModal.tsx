"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertBudget } from "@/lib/actions/budgets";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/lib/types/database.types";

export function BudgetEditModal({
  open,
  onClose,
  category,
  currentLimit,
}: {
  open: boolean;
  onClose: () => void;
  category: Category;
  currentLimit: number;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const limit = Number(formData.get("limit"));
    if (Number.isNaN(limit) || limit < 0) return;
    setPending(true);
    await upsertBudget(category, limit);
    setPending(false);
    onClose();
    router.refresh();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Edit ${category} budget`}>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Monthly limit (₹)"
          name="limit"
          type="number"
          step="1"
          min="0"
          defaultValue={currentLimit}
          required
          autoFocus
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </form>
    </Modal>
  );
}
