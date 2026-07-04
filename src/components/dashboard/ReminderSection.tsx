"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReminder, deleteReminder } from "@/lib/actions/reminders";
import { initialActionState } from "@/lib/actions/shared";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants/categories";
import { formatINR } from "@/lib/utils/currency";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { Database } from "@/lib/types/database.types";

type Reminder = Database["public"]["Tables"]["reminders"]["Row"];

export function ReminderSection({ reminders }: { reminders: Reminder[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const result = await createReminder(initialActionState, formData);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    setOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await deleteReminder(id);
    router.refresh();
  }

  const today = new Date().getDate();
  const upcoming = [...reminders].sort((a, b) => a.due_day - b.due_day);

  return (
    <div className="flex flex-col gap-2">
      {upcoming.length === 0 ? (
        <p className="text-sm text-foreground/50">No bill reminders yet.</p>
      ) : (
        upcoming.map((r) => {
          const diff = r.due_day - today;
          const dueLabel =
            diff === 0
              ? "Due today"
              : diff > 0
                ? `Due in ${diff} day${diff === 1 ? "" : "s"}`
                : `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} overdue`;
          return (
            <div key={r.id} className="glass-card flex items-center gap-3 p-3">
              <span className="text-lg">{CATEGORY_META[r.category].emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{r.title}</div>
                <div className="text-xs text-foreground/50">{dueLabel}</div>
              </div>
              <div className="font-semibold">{formatINR(r.amount)}</div>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                className="cursor-pointer text-foreground/40 hover:text-red-400"
                aria-label="Delete reminder"
              >
                🗑️
              </button>
            </div>
          );
        })
      )}
      <Button variant="secondary" type="button" onClick={() => setOpen(true)}>
        + Add Reminder
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Bill Reminder">
        <form action={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Title" name="title" placeholder="Electricity bill" required autoFocus />
          <FormField label="Amount (₹)" name="amount" type="number" step="0.01" min="0" required />
          <FormField label="Due day of month" name="dueDay" type="number" min="1" max="28" required />
          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground/80">Category</span>
            <select
              name="category"
              defaultValue={CATEGORIES[0]}
              className="glass-card w-full rounded-2xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_META[cat].emoji} {cat}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Add Reminder"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
