import { listExpenses } from "@/lib/actions/expenses";
import { listCategories } from "@/lib/actions/categories";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExportCsvButton } from "@/components/expenses/ExportCsvButton";
import { formatINR } from "@/lib/utils/currency";

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

  const [expenses, customCategories] = await Promise.all([
    listExpenses({
      category: asString(params.category),
      search: asString(params.search),
      dateFrom: asString(params.dateFrom),
      dateTo: asString(params.dateTo),
    }),
    listCategories(),
  ]);

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="flex flex-col gap-4 pt-1">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <ExportCsvButton />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card !rounded-2xl p-4">
          <div className="text-xs font-medium text-muted">Total</div>
          <div className="mt-0.5 text-xl font-extrabold text-[rgb(var(--expense))]">
            {formatINR(total)}
          </div>
        </div>
        <div className="card !rounded-2xl p-4">
          <div className="text-xs font-medium text-muted">Transactions</div>
          <div className="mt-0.5 text-xl font-extrabold">{expenses.length}</div>
        </div>
      </div>

      <ExpenseFilters customCategories={customCategories} />
      <ExpenseList expenses={expenses} />
    </div>
  );
}
