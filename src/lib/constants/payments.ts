import { Banknote, Smartphone, CreditCard, Landmark, type LucideIcon } from "lucide-react";

export const PAYMENT_METHODS: { name: string; icon: LucideIcon; color: string }[] = [
  { name: "Cash", icon: Banknote, color: "#16A34A" },
  { name: "UPI", icon: Smartphone, color: "#7C3AED" },
  { name: "Card", icon: CreditCard, color: "#2563EB" },
  { name: "Bank", icon: Landmark, color: "#0891B2" },
];

export const PAYMENT_ICON: Record<string, LucideIcon> = Object.fromEntries(
  PAYMENT_METHODS.map((p) => [p.name, p.icon])
);
