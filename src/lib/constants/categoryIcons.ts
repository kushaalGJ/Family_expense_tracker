import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  ReceiptText,
  HeartPulse,
  Clapperboard,
  GraduationCap,
  Package,
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
