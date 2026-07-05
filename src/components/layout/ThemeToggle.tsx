"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-12 w-full" />;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="card flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-black/[0.02] dark:hover:bg-white/5"
    >
      <span className="flex items-center gap-2 font-medium">
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
        {isDark ? "Dark mode" : "Light mode"}
      </span>
      <span className="text-muted">Tap to switch</span>
    </button>
  );
}
