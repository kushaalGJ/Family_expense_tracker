import type { LucideIcon } from "lucide-react";

export type Insight = {
  id: string;
  icon: LucideIcon;
  text: string;
  tone: "good" | "bad" | "neutral";
};

const TONE: Record<Insight["tone"], string> = {
  good: "rgb(var(--income))",
  bad: "rgb(var(--expense))",
  neutral: "rgb(var(--savings))",
};

export function InsightCards({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null;

  return (
    <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
      {insights.map((ins) => {
        const Icon = ins.icon;
        const color = TONE[ins.tone];
        return (
          <div
            key={ins.id}
            className="card flex min-w-[200px] max-w-[220px] shrink-0 flex-col gap-3 p-4"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl chip"
              style={{ ["--chip" as string]: color }}
            >
              <Icon size={18} />
            </span>
            <p className="text-[13px] font-medium leading-snug">{ins.text}</p>
          </div>
        );
      })}
    </div>
  );
}
