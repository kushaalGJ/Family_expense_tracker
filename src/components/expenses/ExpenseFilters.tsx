"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants/categories";

const fieldClass =
  "rounded-2xl border border-black/10 bg-[rgb(var(--card))] px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] dark:border-white/10";

export function ExpenseFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          placeholder="Search notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => updateParam("search", search)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("search", search);
          }}
          className={`${fieldClass} w-full pl-9`}
        />
      </div>
      <select
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
        className={fieldClass}
      >
        <option value="">All categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORY_META[cat].emoji} {cat}
          </option>
        ))}
      </select>
      <input
        type="date"
        aria-label="From date"
        defaultValue={searchParams.get("dateFrom") ?? ""}
        onChange={(e) => updateParam("dateFrom", e.target.value)}
        className={fieldClass}
      />
      <input
        type="date"
        aria-label="To date"
        defaultValue={searchParams.get("dateTo") ?? ""}
        onChange={(e) => updateParam("dateTo", e.target.value)}
        className={fieldClass}
      />
    </div>
  );
}
