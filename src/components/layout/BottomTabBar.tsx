"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Target, Users, Trophy, type LucideIcon } from "lucide-react";
import { useMode } from "@/lib/context/ModeContext";

type Tab = { href: string; icon: LucideIcon; label: string };

const BASE_TABS: Tab[] = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/expenses", icon: Receipt, label: "Expenses" },
  { href: "/budgets", icon: Target, label: "Budgets" },
  { href: "/goals", icon: Trophy, label: "Goals" },
];

const FAMILY_TAB: Tab = { href: "/family", icon: Users, label: "Family" };

export function BottomTabBar() {
  const pathname = usePathname();
  const { mode } = useMode();
  const tabs =
    mode === "family" ? [...BASE_TABS.slice(0, 3), FAMILY_TAB, BASE_TABS[3]] : BASE_TABS;

  return (
    <nav className="sticky bottom-0 z-30 border-t border-black/5 bg-[rgb(var(--card))]/85 backdrop-blur-lg dark:border-white/10">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors ${
                active ? "text-[rgb(var(--accent))]" : "text-muted hover:text-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
