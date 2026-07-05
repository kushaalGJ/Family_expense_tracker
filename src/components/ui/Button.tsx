import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "gradient-accent text-white shadow-lg shadow-[rgb(var(--accent))]/25 hover:brightness-105 disabled:opacity-50",
  secondary:
    "bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/5 disabled:opacity-50",
  ghost: "hover:bg-black/[0.04] dark:hover:bg-white/5 disabled:opacity-50",
  danger:
    "bg-[rgb(var(--expense))] text-white shadow-lg shadow-[rgb(var(--expense))]/25 hover:brightness-105 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[18px] px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
