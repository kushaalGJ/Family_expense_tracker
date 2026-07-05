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
        className={`w-full rounded-2xl border border-black/10 bg-black/[0.03] px-3.5 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[rgb(var(--accent))] placeholder:opacity-40 dark:border-white/10 dark:bg-white/5 ${className}`}
        {...props}
      />
    </label>
  );
}
