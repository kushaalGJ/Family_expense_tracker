"use client";

import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";

export function ExportCsvButton() {
  const searchParams = useSearchParams();
  const href = `/api/expenses/export?${searchParams.toString()}`;

  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 rounded-2xl border border-black/10 bg-[rgb(var(--card))] px-3.5 py-2 text-sm font-medium hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/5"
    >
      <Download size={15} /> Export CSV
    </a>
  );
}
