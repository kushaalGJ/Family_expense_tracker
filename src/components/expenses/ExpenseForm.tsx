"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, Loader2, Check, X } from "lucide-react";
import { createExpense } from "@/lib/actions/expenses";
import { initialActionState } from "@/lib/actions/shared";
import { autoCategorize } from "@/lib/utils/autoCategorize";
import { CATEGORIES, categoryColor } from "@/lib/constants/categories";
import { categoryIconFor } from "@/lib/constants/categoryIcons";
import { PAYMENT_METHODS } from "@/lib/constants/payments";
import { todayISODate } from "@/lib/utils/dates";
import { useMode } from "@/lib/context/ModeContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import type { CategoryRow } from "@/lib/actions/categories";

export function ExpenseForm({ customCategories = [] }: { customCategories?: CategoryRow[] }) {
  const [state, formAction, isPending] = useActionState(createExpense, initialActionState);
  const { mode, userId } = useMode();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [payment, setPayment] = useState("Cash");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const allCategories: { name: string; icon?: string | null; color?: string }[] = [
    ...CATEGORIES.map((c) => ({ name: c as string })),
    ...customCategories.map((c) => ({ name: c.name, icon: c.icon, color: c.color })),
  ];

  function handleNote(value: string) {
    setNote(value);
    if (!categoryTouched) {
      const suggestion = autoCategorize(value);
      if (suggestion) setCategory(suggestion);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const path = `${userId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from("receipts").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("receipts").getPublicUrl(path);
      setAttachmentUrl(data.publicUrl);
    }
    setUploading(false);
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Amount */}
      <div className="flex flex-col items-center py-2">
        <label className="text-xs font-semibold text-muted">Amount</label>
        <div className="mt-1 flex items-center">
          <span className="text-3xl font-bold text-muted">₹</span>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            autoFocus
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-44 bg-transparent text-center text-5xl font-extrabold tracking-tight outline-none placeholder:text-muted/40"
          />
        </div>
      </div>

      {/* Category grid */}
      <div>
        <div className="mb-2 text-sm font-semibold">Category</div>
        <input type="hidden" name="category" value={category} />
        <div className="grid grid-cols-4 gap-2.5">
          {allCategories.map((c) => {
            const active = category === c.name;
            const color = c.color ?? categoryColor(c.name);
            const Icon = categoryIconFor(c.name, c.icon);
            return (
              <motion.button
                key={c.name}
                type="button"
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  setCategory(c.name);
                  setCategoryTouched(true);
                }}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition-colors ${
                  active
                    ? "border-transparent text-white"
                    : "border-[rgb(var(--card-border))] dark:border-white/10"
                }`}
                style={active ? { background: color } : undefined}
              >
                <Icon size={20} style={!active ? { color } : undefined} />
                <span className="truncate text-[10px] font-semibold">{c.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Payment method */}
      <div>
        <div className="mb-2 text-sm font-semibold">Payment method</div>
        <input type="hidden" name="paymentMethod" value={payment} />
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((p) => {
            const active = payment === p.name;
            const Icon = p.icon;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setPayment(p.name)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active ? "border-transparent text-white" : "border-[rgb(var(--card-border))] dark:border-white/10"
                }`}
                style={active ? { background: p.color } : { color: p.color }}
              >
                <Icon size={15} /> {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <FormField label="Note" name="note" value={note} onChange={(e) => handleNote(e.target.value)} placeholder="e.g. Uber ride" />
      <FormField label="Date" name="date" type="date" defaultValue={todayISODate()} required />

      {/* Attachment */}
      <div>
        <div className="mb-2 text-sm font-semibold">Receipt (optional)</div>
        <input type="hidden" name="attachmentUrl" value={attachmentUrl} />
        <label className="flex cursor-pointer items-center gap-2 rounded-[18px] border border-dashed border-[rgb(var(--card-border))] px-4 py-3 text-sm text-muted dark:border-white/15">
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : attachmentUrl ? (
            <Check size={16} className="text-[rgb(var(--income))]" />
          ) : (
            <Paperclip size={16} />
          )}
          {uploading ? "Uploading…" : attachmentUrl ? "Receipt attached" : "Attach a photo or PDF"}
          <input type="file" accept="image/*,application/pdf" onChange={handleFile} className="hidden" />
          {attachmentUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setAttachmentUrl("");
              }}
              className="ml-auto"
              aria-label="Remove attachment"
            >
              <X size={15} />
            </button>
          )}
        </label>
      </div>

      <div className="flex flex-col gap-3">
        {mode === "family" && (
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="isShared" className="h-4 w-4 rounded accent-[rgb(var(--accent))]" />
            Shared with family
          </label>
        )}
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="isRecurring" className="h-4 w-4 rounded accent-[rgb(var(--accent))]" />
          Recurring
        </label>
      </div>

      {state.error && <p className="text-sm text-[rgb(var(--expense))]">{state.error}</p>}
      <Button type="submit" disabled={isPending || uploading} className="w-full">
        {isPending ? "Saving…" : "Add expense"}
      </Button>
    </form>
  );
}
