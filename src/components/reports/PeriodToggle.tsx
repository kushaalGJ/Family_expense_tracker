"use client";

import { useRouter } from "next/navigation";

const PERIODS = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

export function PeriodToggle({ active }: { active: string }) {
  const router = useRouter();
  return (
    <div className="flex gap-1 rounded-full border border-[rgb(var(--card-border))] bg-[rgb(var(--card))] p-1 dark:border-white/10">
      {PERIODS.map((p) => {
        const on = active === p.key;
        return (
          <button
            key={p.key}
            type="button"
            onClick={() => router.push(`/reports?period=${p.key}`)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              on ? "gradient-accent text-white" : "text-muted"
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
