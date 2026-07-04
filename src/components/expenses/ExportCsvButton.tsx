"use client";

import { useSearchParams } from "next/navigation";

export function ExportCsvButton() {
  const searchParams = useSearchParams();
  const href = `/api/expenses/export?${searchParams.toString()}`;

  return (
    <a
      href={href}
      className="glass-card inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-sm hover:bg-white/10"
    >
      ⬇️ Export CSV
    </a>
  );
}
