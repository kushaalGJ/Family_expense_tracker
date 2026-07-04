import type { InputHTMLAttributes } from "react";

export function FormField({
  label,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground/80">{label}</span>
      <input
        className={`glass-card w-full rounded-2xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] placeholder:text-foreground/40 ${className}`}
        {...props}
      />
    </label>
  );
}
