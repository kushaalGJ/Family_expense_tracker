"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

const PIN_KEY = "fs_pin";
const UNLOCK_KEY = "fs_unlocked";

export function AppLockSetting() {
  const [enabled, setEnabled] = useState(false);
  const [prompting, setPrompting] = useState(false);
  const [pin, setPin] = useState("");

  useEffect(() => setEnabled(Boolean(localStorage.getItem(PIN_KEY))), []);

  function toggle() {
    if (enabled) {
      localStorage.removeItem(PIN_KEY);
      sessionStorage.removeItem(UNLOCK_KEY);
      setEnabled(false);
    } else {
      setPrompting(true);
    }
  }

  function savePin() {
    if (pin.length !== 4) return;
    localStorage.setItem(PIN_KEY, pin);
    sessionStorage.setItem(UNLOCK_KEY, "1");
    setEnabled(true);
    setPrompting(false);
    setPin("");
  }

  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--accent))]/12 text-[rgb(var(--accent))]">
          <Lock size={17} />
        </span>
        <div className="flex-1">
          <div className="text-sm font-semibold">App lock</div>
          <div className="text-xs text-muted">Require a PIN to open the app</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={toggle}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            enabled ? "bg-[rgb(var(--accent))]" : "bg-black/15 dark:bg-white/20"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
      {prompting && (
        <div className="flex items-center gap-2">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="4-digit PIN"
            className="flex-1 rounded-[14px] border border-[rgb(var(--card-border))] bg-black/[0.02] px-3 py-2 text-sm tracking-[0.3em] outline-none dark:border-white/10 dark:bg-white/5"
            autoFocus
          />
          <button
            type="button"
            onClick={savePin}
            disabled={pin.length !== 4}
            className="rounded-[14px] gradient-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
}
