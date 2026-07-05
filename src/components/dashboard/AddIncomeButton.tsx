"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createIncome } from "@/lib/actions/income";
import { initialActionState } from "@/lib/actions/shared";
import { todayISODate } from "@/lib/utils/dates";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export function AddIncomeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const result = await createIncome(initialActionState, formData);
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
    <Modal open={open} onClose={onClose} title="Add income">
      <form action={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Amount (₹)" name="amount" type="number" step="0.01" min="0" required autoFocus />
        <FormField label="Source" name="source" placeholder="Salary, freelance, etc." />
        <FormField label="Date" name="date" type="date" defaultValue={todayISODate()} required />
        {error && <p className="text-sm text-[rgb(var(--expense))]">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add income"}
        </Button>
      </form>
    </Modal>
  );
}

export function AddIncomeButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" type="button" onClick={() => setOpen(true)}>
        <Plus size={16} /> Add income
      </Button>
      <AddIncomeSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
