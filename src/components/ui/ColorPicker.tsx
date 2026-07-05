"use client";

import { useState } from "react";
import { COLOR_OPTIONS } from "@/lib/constants/avatar";

export function ColorPicker({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [selected, setSelected] = useState(defaultValue ?? COLOR_OPTIONS[0]);

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium opacity-80">Color</span>
      <input type="hidden" name={name} value={selected} />
      <div className="flex flex-wrap gap-2">
        {COLOR_OPTIONS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelected(color)}
            aria-pressed={selected === color}
            className={`h-8 w-8 rounded-full transition-transform cursor-pointer ${
              selected === color
                ? "ring-2 ring-offset-2 ring-offset-[rgb(var(--card))] ring-foreground scale-110"
                : ""
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
