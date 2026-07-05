"use client";

import { useState } from "react";
import { EMOJI_OPTIONS } from "@/lib/constants/avatar";

export function EmojiPicker({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [selected, setSelected] = useState(defaultValue ?? EMOJI_OPTIONS[0]);

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium opacity-80">Avatar</span>
      <input type="hidden" name={name} value={selected} />
      <div className="grid grid-cols-8 gap-2">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setSelected(emoji)}
            aria-pressed={selected === emoji}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-colors cursor-pointer ${
              selected === emoji
                ? "bg-[rgb(var(--accent))]/25 ring-2 ring-[rgb(var(--accent))]"
                : "border border-black/10 hover:bg-black/[0.04] dark:border-white/10 dark:hover:bg-white/5"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
