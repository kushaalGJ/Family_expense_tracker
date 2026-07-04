"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-10 w-full" />;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass-card flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-sm hover:bg-white/10"
    >
      <span>{isDark ? "🌙 Dark mode" : "☀️ Light mode"}</span>
      <span className="text-foreground/50">Tap to switch</span>
    </button>
  );
}
