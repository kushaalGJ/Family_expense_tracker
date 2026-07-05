"use client";

import Link from "next/link";
import { Settings, LogOut } from "lucide-react";
import { useMode } from "@/lib/context/ModeContext";
import { signOut } from "@/lib/actions/auth";

export function GradientHeader() {
  const { mode, profile, familyName } = useMode();

  return (
    <header
      className="gradient-header rounded-b-3xl px-4 pb-8 pt-5 text-white"
      style={{ "--user-color": profile.color } as React.CSSProperties}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-xl backdrop-blur-sm">
            {profile.emoji}
          </span>
          <div>
            <div className="text-xs text-white/70">
              {mode === "family" ? familyName ?? "Family" : "Private account"}
            </div>
            <div className="font-semibold leading-tight">{profile.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
            aria-label="Settings"
          >
            <Settings size={18} />
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
