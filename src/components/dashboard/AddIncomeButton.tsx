"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIncome } from "@/lib/actions/income";
import { initialActionState } from "@/lib/actions/shared";
import { todayISODate } from "@/lib/utils/dates";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export function AddIncomeButton() {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button variant="secondary" type="button" onClick={() => setOpen(true)}>
        + Add Income
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Income">
        <form action={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Amount (₹)" name="amount" type="number" step="0.01" min="0" required autoFocus />
          <FormField label="Source" name="source" placeholder="Salary, freelance, etc." />
          <FormField label="Date" name="date" type="date" defaultValue={todayISODate()} required />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Add Income"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
