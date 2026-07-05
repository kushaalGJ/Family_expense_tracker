"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function JoinCodeCard({ familyName, code }: { familyName: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card className="flex items-center justify-between">
      <div>
        <div className="text-sm text-muted">{familyName}</div>
        <div className="text-2xl font-bold tracking-widest text-[rgb(var(--accent))]">{code}</div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border border-black/10 px-3.5 py-2 text-sm font-medium hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/5"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </Card>
  );
}
