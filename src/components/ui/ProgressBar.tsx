"use client";

import { motion } from "framer-motion";

export function ProgressBar({
  pct,
  color = "rgb(var(--accent))",
  className = "",
}: {
  pct: number;
  color?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10 ${className}`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}
