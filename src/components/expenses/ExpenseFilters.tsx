"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants/categories";

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
      <input
        type="search"
        placeholder="Search notes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={() => updateParam("search", search)}
        onKeyDown={(e) => {
          if (e.key === "Enter") updateParam("search", search);
        }}
        className="glass-card min-w-0 flex-1 rounded-2xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
      />
      <select
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
        className="glass-card rounded-2xl px-3.5 py-2 text-sm outline-none"
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
        className="glass-card rounded-2xl px-3.5 py-2 text-sm outline-none"
      />
      <input
        type="date"
        aria-label="To date"
        defaultValue={searchParams.get("dateTo") ?? ""}
        onChange={(e) => updateParam("dateTo", e.target.value)}
        className="glass-card rounded-2xl px-3.5 py-2 text-sm outline-none"
      />
    </div>
  );
}
