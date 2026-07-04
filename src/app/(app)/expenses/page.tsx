import Link from "next/link";
import { listExpenses } from "@/lib/actions/expenses";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExportCsvButton } from "@/components/expenses/ExportCsvButton";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/lib/types/database.types";

type SearchParams = Record<string, string | string[] | undefined>;

function asString(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const expenses = await listExpenses({
    category: asString(params.category) as Category | undefined,
    search: asString(params.search),
    dateFrom: asString(params.dateFrom),
    dateTo: asString(params.dateTo),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Expenses</h1>
        <Link href="/expenses/new">
          <Button>+ Add</Button>
        </Link>
      </div>
      <ExpenseFilters />
      <div className="flex justify-end">
        <ExportCsvButton />
      </div>
      <ExpenseList expenses={expenses} />
    </div>
  );
}
