"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowDownLeft, Target, BarChart3, Trophy, Users } from "lucide-react";
import { AddIncomeSheet } from "@/components/dashboard/AddIncomeButton";
import { useMode } from "@/lib/context/ModeContext";

export function QuickActions() {
  const router = useRouter();
  const { mode } = useMode();
  const [incomeOpen, setIncomeOpen] = useState(false);

  const actions = [
    { label: "Expense", icon: Plus, color: "rgb(var(--expense))", run: () => router.push("/expenses/new") },
    { label: "Income", icon: ArrowDownLeft, color: "rgb(var(--income))", run: () => setIncomeOpen(true) },
    { label: "Budgets", icon: Target, color: "rgb(var(--accent))", run: () => router.push("/budgets") },
    { label: "Reports", icon: BarChart3, color: "rgb(var(--savings))", run: () => router.push("/reports") },
    mode === "family"
      ? { label: "Family", icon: Users, color: "#8B5CF6", run: () => router.push("/family") }
      : { label: "Goals", icon: Trophy, color: "#F59E0B", run: () => router.push("/goals") },
  ];

  return (
    <>
      <div className="grid grid-cols-5 gap-2">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.button
              key={a.label}
              type="button"
              onClick={a.run}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.94 }}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <span
                className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl chip"
                style={{ ["--chip" as string]: a.color }}
              >
                <Icon size={22} strokeWidth={2.2} />
              </span>
              <span className="text-[11px] font-semibold text-muted">{a.label}</span>
            </motion.button>
          );
        })}
      </div>
      <AddIncomeSheet open={incomeOpen} onClose={() => setIncomeOpen(false)} />
    </>
  );
}
