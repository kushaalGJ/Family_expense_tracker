import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[rgb(var(--accent))] text-white shadow-sm hover:opacity-90 disabled:opacity-50",
  secondary:
    "bg-[rgb(var(--card))] border border-black/10 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/5 disabled:opacity-50",
  ghost:
    "hover:bg-black/[0.04] dark:hover:bg-white/5 disabled:opacity-50",
  danger:
    "bg-[rgb(var(--expense))] text-white shadow-sm hover:opacity-90 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
