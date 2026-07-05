"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MonthSelector({ year, month }: { year: number; month: number }) {
  const router = useRouter();
  const current = new Date();
  const isCurrentMonth = year === current.getFullYear() && month === current.getMonth();

  const label = new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  function go(delta: number) {
    const d = new Date(year, month + delta, 1);
    const param = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    router.push(`/dashboard?month=${param}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-black/10 bg-[rgb(var(--card))] px-1 py-0.5 dark:border-white/10">
      <button
        type="button"
        onClick={() => go(-1)}
        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        aria-label="Previous month"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="min-w-[92px] text-center text-xs font-medium">{label}</span>
      <button
        type="button"
        onClick={() => go(1)}
        disabled={isCurrentMonth}
        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10 cursor-pointer"
        aria-label="Next month"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
