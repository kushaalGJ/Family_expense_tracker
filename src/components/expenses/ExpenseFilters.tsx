"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES, categoryColor } from "@/lib/constants/categories";
import type { CategoryRow } from "@/lib/actions/categories";

export function ExpenseFilters({ customCategories = [] }: { customCategories?: CategoryRow[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const activeCat = searchParams.get("category") ?? "";

  const chips = ["", ...CATEGORIES.map(String), ...customCategories.map((c) => c.name)];

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="sticky top-[68px] z-20 -mx-5 bg-[var(--background)]/85 px-5 pb-2 pt-1 backdrop-blur-lg">
      <div className="relative">
        <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search transactions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => updateParam("search", search)}
          onKeyDown={(e) => e.key === "Enter" && updateParam("search", search)}
          className="w-full rounded-full border border-[rgb(var(--card-border))] bg-[rgb(var(--card))] py-3 pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-[rgb(var(--accent))]/15 dark:border-white/10"
        />
      </div>
      <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto">
        {chips.map((c) => {
          const active = activeCat === c;
          const color = c ? categoryColor(c) : "rgb(var(--accent))";
          return (
            <button
              key={c || "all"}
              type="button"
              onClick={() => updateParam("category", c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                active ? "text-white" : "border border-[rgb(var(--card-border))] text-muted dark:border-white/10"
              }`}
              style={active ? { background: color } : undefined}
            >
              {c || "All"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
