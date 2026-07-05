"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteAccount } from "@/lib/actions/auth";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    await deleteAccount();
    // deleteAccount redirects on success; if it returns, reset.
    setPending(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="card flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-[rgb(var(--expense))]/5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--expense))]/12 text-[rgb(var(--expense))]">
          <Trash2 size={17} />
        </span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-[rgb(var(--expense))]">Delete account</div>
          <div className="text-xs text-muted">Permanently remove your account and all data</div>
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Delete account">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-2xl bg-[rgb(var(--expense))]/10 p-3.5 text-sm text-[rgb(var(--expense))]">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>
              This permanently deletes your account and all your expenses, budgets, goals, and
              family profile. This can&apos;t be undone.
            </span>
          </div>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium opacity-80">
              Type <span className="font-bold">DELETE</span> to confirm
            </span>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-[18px] border border-[rgb(var(--card-border))] bg-black/[0.02] px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[rgb(var(--expense))]/15 dark:border-white/10 dark:bg-white/5"
            />
          </label>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={confirm !== "DELETE" || pending}
            className="w-full"
          >
            {pending ? "Deleting…" : "Delete my account"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
