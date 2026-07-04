"use client";

import Link from "next/link";
import { useMode } from "@/lib/context/ModeContext";
import { signOut } from "@/lib/actions/auth";

export function GradientHeader() {
  const { mode, profile, familyName } = useMode();

  return (
    <header
      className="header-gradient px-4 pb-6 pt-5 text-white"
      style={{ "--user-color": profile.color } as React.CSSProperties}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-xl">
            {profile.emoji}
          </span>
          <div>
            <div className="font-semibold leading-tight">{profile.name}</div>
            <div className="text-xs text-white/75">
              {mode === "family" ? familyName ?? "Family" : "Private account"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/settings" className="opacity-80 hover:opacity-100" aria-label="Settings">
            ⚙️
          </Link>
          <form action={signOut}>
            <button type="submit" className="opacity-80 hover:opacity-100 cursor-pointer" aria-label="Sign out">
              ↩️
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
