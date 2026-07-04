"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMode } from "@/lib/context/ModeContext";

const BASE_TABS = [
  { href: "/dashboard", emoji: "🏠", label: "Home" },
  { href: "/expenses", emoji: "🧾", label: "Expenses" },
  { href: "/budgets", emoji: "🎯", label: "Budgets" },
  { href: "/goals", emoji: "🏆", label: "Goals" },
];

const FAMILY_TAB = { href: "/family", emoji: "👨‍👩‍👧‍👦", label: "Family" };

export function BottomTabBar() {
  const pathname = usePathname();
  const { mode } = useMode();
  const tabs =
    mode === "family"
      ? [...BASE_TABS.slice(0, 3), FAMILY_TAB, BASE_TABS[3]]
      : BASE_TABS;

  return (
    <nav className="sticky bottom-0 border-t border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs transition-colors ${
                active ? "text-[rgb(var(--accent))]" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <span className="text-lg">{tab.emoji}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
