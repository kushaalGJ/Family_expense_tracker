import Link from "next/link";
import { Plus } from "lucide-react";

export function AddFab() {
  return (
    <Link
      href="/expenses/new"
      aria-label="Add expense"
      className="fixed bottom-20 right-[max(1rem,calc(50%-20rem+1rem))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(var(--accent))] text-white shadow-lg shadow-[rgb(var(--accent))]/40 transition-transform hover:scale-105 active:scale-95"
    >
      <Plus size={26} strokeWidth={2.5} />
    </Link>
  );
}
