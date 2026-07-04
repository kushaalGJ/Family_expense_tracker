"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="glass-card flex flex-col items-center gap-3 p-6 text-center">
      <p className="text-sm text-foreground/70">Something went wrong loading this page.</p>
      <button
        onClick={() => reset()}
        className="glass-card cursor-pointer rounded-2xl px-4 py-2 text-sm hover:bg-white/10"
      >
        Try again
      </button>
    </div>
  );
}
