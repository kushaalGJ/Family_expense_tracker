"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Receipt,
  Target,
  Users,
  Trophy,
  Plus,
  ArrowDownLeft,
  ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";
import { useMode } from "@/lib/context/ModeContext";
import { AddIncomeSheet } from "@/components/dashboard/AddIncomeButton";

type Tab = { href: string; icon: LucideIcon; label: string };

const LEFT: Tab[] = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/expenses", icon: Receipt, label: "Expenses" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode } = useMode();
  const [open, setOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);

  const right: Tab[] = [
    { href: "/budgets", icon: Target, label: "Budgets" },
    mode === "family"
      ? { href: "/family", icon: Users, label: "Family" }
      : { href: "/goals", icon: Trophy, label: "Goals" },
  ];

  const actions = [
    { label: "Expense", icon: Receipt, color: "rgb(var(--expense))", run: () => router.push("/expenses/new") },
    { label: "Income", icon: ArrowDownLeft, color: "rgb(var(--income))", run: () => setIncomeOpen(true) },
    { label: "Transfer", icon: ArrowLeftRight, color: "rgb(var(--savings))", run: () => router.push("/goals") },
    { label: "Goal", icon: Trophy, color: "rgb(var(--accent))", run: () => router.push("/goals?new=1") },
  ];

  function tab(t: Tab) {
    const active = pathname.startsWith(t.href);
    const Icon = t.icon;
    return (
      <Link
        key={t.href}
        href={t.href}
        className="relative flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-semibold"
      >
        {active && (
          <motion.span
            layoutId="nav-active"
            className="absolute -top-1 h-1 w-1 rounded-full bg-[rgb(var(--accent))]"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <Icon
          size={22}
          strokeWidth={active ? 2.5 : 2}
          className={active ? "text-[rgb(var(--accent))]" : "text-muted"}
        />
        <span className={active ? "text-[rgb(var(--accent))]" : "text-muted"}>{t.label}</span>
      </Link>
    );
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-4">
        <div className="pointer-events-auto relative mx-4 flex w-full max-w-md items-center rounded-[26px] glass px-3 py-2 shadow-[var(--card-shadow-lg)]">
          {LEFT.map(tab)}

          <div className="relative flex w-16 shrink-0 justify-center">
            <AnimatePresence>
              {open && (
                <motion.div
                  className="absolute bottom-16 flex flex-col items-center gap-2.5"
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{ show: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
                >
                  {actions.map((a) => {
                    const Icon = a.icon;
                    return (
                      <motion.button
                        key={a.label}
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          a.run();
                        }}
                        variants={{
                          hidden: { opacity: 0, y: 16, scale: 0.8 },
                          show: { opacity: 1, y: 0, scale: 1 },
                        }}
                        className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[rgb(var(--card))] py-2 pl-2 pr-4 text-sm font-semibold shadow-lg cursor-pointer"
                      >
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                          style={{ background: a.color }}
                        >
                          <Icon size={16} />
                        </span>
                        {a.label}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Add"
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="absolute -top-8 flex h-14 w-14 items-center justify-center rounded-full gradient-accent text-white shadow-xl shadow-[rgb(var(--accent))]/40 cursor-pointer"
            >
              <Plus size={26} strokeWidth={2.6} />
            </motion.button>
          </div>

          {right.map(tab)}
        </div>
      </div>

      <AddIncomeSheet open={incomeOpen} onClose={() => setIncomeOpen(false)} />
    </>
  );
}
