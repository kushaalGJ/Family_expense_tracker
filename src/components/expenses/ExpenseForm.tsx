"use client";

import { useActionState, useState } from "react";
import { createExpense } from "@/lib/actions/expenses";
import { initialActionState } from "@/lib/actions/shared";
import { autoCategorize } from "@/lib/utils/autoCategorize";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants/categories";
import type { Category } from "@/lib/types/database.types";
import { useMode } from "@/lib/context/ModeContext";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

export function ExpenseForm() {
  const [state, formAction, isPending] = useActionState(createExpense, initialActionState);
  const { mode } = useMode();
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [autoSuggested, setAutoSuggested] = useState(false);

  function handleNoteChange(value: string) {
    setNote(value);
    if (!categoryTouched) {
      const suggestion = autoCategorize(value);
      if (suggestion) {
        setCategory(suggestion);
        setAutoSuggested(true);
      }
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField label="Amount (₹)" name="amount" type="number" step="0.01" min="0" required autoFocus />
      <FormField
        label="Note"
        name="note"
        value={note}
        onChange={(e) => handleNoteChange(e.target.value)}
        placeholder="e.g. Uber ride"
      />
      <div className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground/80">
          Category{" "}
          {autoSuggested && <span className="text-xs text-[rgb(var(--accent))]">(auto-detected)</span>}
        </span>
        <select
          name="category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as Category);
            setCategoryTouched(true);
            setAutoSuggested(false);
          }}
          className="glass-card w-full rounded-2xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_META[cat].emoji} {cat}
            </option>
          ))}
        </select>
      </div>
      <FormField label="Date" name="date" type="date" defaultValue={today} required />
      {mode === "family" && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isShared" className="h-4 w-4 rounded" />
          Shared with family
        </label>
      )}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isRecurring" className="h-4 w-4 rounded" />
        Recurring
      </label>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Add Expense"}
      </Button>
    </form>
  );
}
