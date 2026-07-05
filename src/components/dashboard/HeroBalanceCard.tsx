"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, PiggyBank } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function HeroBalanceCard({
  balance,
  income,
  expense,
  savings,
}: {
  balance: number;
  income: number;
  expense: number;
  savings: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="gradient-accent relative overflow-hidden rounded-[28px] p-6 text-white shadow-[0_24px_50px_-18px_rgba(29,185,84,0.5)]"
    >
      <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-8 h-44 w-44 rounded-full bg-black/10 blur-2xl" />

      <div className="relative">
        <div className="text-sm font-medium text-white/80">Available balance</div>
        <AnimatedCounter value={balance} className="mt-1 block text-[42px] font-extrabold leading-none tracking-tight" />

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Stat icon={<ArrowUpRight size={15} />} label="Income" value={income} />
          <Stat icon={<ArrowDownRight size={15} />} label="Expense" value={expense} />
          <Stat icon={<PiggyBank size={15} />} label="Savings" value={savings} />
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/15 px-3 py-2.5 backdrop-blur-sm">
      <div className="flex items-center gap-1 text-[11px] font-medium text-white/80">
        {icon}
        {label}
      </div>
      <AnimatedCounter value={value} className="mt-0.5 block text-[15px] font-bold" />
    </div>
  );
}
