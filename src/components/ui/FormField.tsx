import type { InputHTMLAttributes } from "react";

export function FormField({
  label,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium opacity-80">{label}</span>
      <input
        className={`w-full rounded-[18px] border border-[rgb(var(--card-border))] bg-black/[0.02] px-4 py-3 text-sm outline-none transition focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent))]/15 placeholder:opacity-40 dark:border-white/10 dark:bg-white/5 ${className}`}
        {...props}
      />
    </label>
  );
}
