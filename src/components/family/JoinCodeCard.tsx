"use client";

import { useState } from "react";
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
        <div className="text-sm text-foreground/60">{familyName}</div>
        <div className="text-2xl font-bold tracking-widest">{code}</div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="glass-card cursor-pointer rounded-2xl px-3.5 py-2 text-sm hover:bg-white/10"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </Card>
  );
}
