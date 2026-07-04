import { NextRequest } from "next/server";
import { listExpenses } from "@/lib/actions/expenses";
import { toCsv } from "@/lib/utils/csv";
import type { Category } from "@/lib/types/database.types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const expenses = await listExpenses({
    search: searchParams.get("search") || undefined,
    category: (searchParams.get("category") as Category) || undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
  });

  return new Response(toCsv(expenses), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="expenses.csv"',
    },
  });
}
