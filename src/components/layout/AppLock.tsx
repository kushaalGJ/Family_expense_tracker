"use client";

import { useEffect, useState } from "react";
import { Lock, Delete } from "lucide-react";

// ponytail: soft convenience lock, not real security — the PIN lives in
// localStorage so anyone with device access could read it. It deters casual
// snooping over your shoulder, nothing more. Real auth is Supabase.
const PIN_KEY = "fs_pin";
const UNLOCK_KEY = "fs_unlocked";

export function AppLock({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [entry, setEntry] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const pin = localStorage.getItem(PIN_KEY);
    const unlocked = sessionStorage.getItem(UNLOCK_KEY) === "1";
    setLocked(Boolean(pin) && !unlocked);
    setReady(true);
  }, []);

  function press(digit: string) {
    const next = (entry + digit).slice(0, 4);
    setEntry(next);
    if (next.length === 4) {
      if (next === localStorage.getItem(PIN_KEY)) {
        sessionStorage.setItem(UNLOCK_KEY, "1");
        setLocked(false);
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setEntry("");
        }, 500);
      }
    }
  }

  if (!ready) return null;

  if (locked) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-[var(--background)] px-8">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(var(--accent))]/12 text-[rgb(var(--accent))]">
            <Lock size={28} />
          </span>
          <div className="text-lg font-bold">Enter your PIN</div>
        </div>
        <div className={`flex gap-3 ${shake ? "animate-pulse" : ""}`}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-4 w-4 rounded-full ${
                entry.length > i ? "bg-[rgb(var(--accent))]" : "bg-black/15 dark:bg-white/20"
              }`}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) =>
            k === "" ? (
              <span key={i} />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => (k === "del" ? setEntry(entry.slice(0, -1)) : press(k))}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(var(--card))] text-2xl font-semibold shadow-sm active:scale-95"
              >
                {k === "del" ? <Delete size={22} /> : k}
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
