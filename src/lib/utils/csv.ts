import type { Database } from "@/lib/types/database.types";

type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];

function escape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function toCsv(rows: ExpenseRow[]): string {
  const header = ["Date", "Category", "Note", "Amount", "Shared", "Recurring"];
  const lines = rows.map((r) =>
    [
      r.date,
      r.category,
      escape(r.note ?? ""),
      r.amount.toFixed(2),
      r.is_shared ? "Yes" : "No",
      r.is_recurring ? "Yes" : "No",
    ].join(",")
  );
  return [header.join(","), ...lines].join("\n");
}
