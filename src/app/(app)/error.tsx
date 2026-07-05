"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="card mt-6 flex flex-col items-center gap-3 p-6 text-center">
      <p className="text-sm text-muted">Something went wrong loading this page.</p>
      <button
        onClick={() => reset()}
        className="cursor-pointer rounded-2xl bg-[rgb(var(--accent))] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
