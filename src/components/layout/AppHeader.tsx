"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Settings, LogOut } from "lucide-react";
import { useMode } from "@/lib/context/ModeContext";
import { signOut } from "@/lib/actions/auth";

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function AppHeader() {
  const { profile, mode, familyName } = useMode();
  // Compute time-based greeting/date after mount to avoid hydration mismatch.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  return (
    <header className="sticky top-0 z-30 bg-[var(--background)]/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-3.5">
        <Link href="/settings" aria-label="Profile" className="shrink-0">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl shadow-sm ring-1 ring-black/5"
            style={{ backgroundColor: `${profile.color}22` }}
          >
            {profile.emoji}
          </span>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-muted">
            {now ? `${greeting(now.getHours())},` : " "}
          </div>
          <div className="truncate text-[17px] font-bold leading-tight">
            {profile.name}
            {mode === "family" && familyName && (
              <span className="ml-1.5 align-middle text-xs font-medium text-muted">
                · {familyName}
              </span>
            )}
          </div>
        </div>
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
        >
          <Settings size={19} />
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            aria-label="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10 cursor-pointer"
          >
            <LogOut size={19} />
          </button>
        </form>
      </div>
    </header>
  );
}
