import type { Category } from "@/lib/types/database.types";

const KEYWORD_MAP: Record<string, Category> = {
  uber: "Transport",
  ola: "Transport",
  taxi: "Transport",
  fuel: "Transport",
  petrol: "Transport",
  metro: "Transport",
  netflix: "Entertainment",
  spotify: "Entertainment",
  movie: "Entertainment",
  prime: "Entertainment",
  hotstar: "Entertainment",
  zomato: "Food",
  swiggy: "Food",
  restaurant: "Food",
  grocery: "Food",
  groceries: "Food",
  cafe: "Food",
  amazon: "Shopping",
  flipkart: "Shopping",
  myntra: "Shopping",
  mall: "Shopping",
  electricity: "Bills",
  water: "Bills",
  wifi: "Bills",
  internet: "Bills",
  rent: "Bills",
  broadband: "Bills",
  doctor: "Health",
  pharmacy: "Health",
  hospital: "Health",
  medicine: "Health",
  school: "Education",
  tuition: "Education",
  course: "Education",
  books: "Education",
};

export function autoCategorize(note: string): Category | null {
  const lower = note.toLowerCase();
  for (const [keyword, category] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) return category;
  }
  return null;
}
