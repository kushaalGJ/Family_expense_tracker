import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  ReceiptText,
  HeartPulse,
  Clapperboard,
  GraduationCap,
  Package,
  Fuel,
  Plane,
  Home,
  Gift,
  Dumbbell,
  Coffee,
  Wallet,
  TrendingUp,
  ShoppingCart,
  Tag,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/types/database.types";

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Food: UtensilsCrossed,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: ReceiptText,
  Health: HeartPulse,
  Entertainment: Clapperboard,
  Education: GraduationCap,
  Other: Package,
};

/** Icons selectable for custom categories. */
export const ICON_LIBRARY: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  ShoppingCart,
  ReceiptText,
  HeartPulse,
  Clapperboard,
  GraduationCap,
  Fuel,
  Plane,
  Home,
  Gift,
  Dumbbell,
  Coffee,
  Wallet,
  TrendingUp,
  Package,
  Tag,
};

/** Resolve an icon for any category: built-in name, custom icon key, or fallback. */
export function categoryIconFor(name: string, iconKey?: string | null): LucideIcon {
  if (iconKey && ICON_LIBRARY[iconKey]) return ICON_LIBRARY[iconKey];
  return (CATEGORY_ICON as Record<string, LucideIcon>)[name] ?? Tag;
}
