/** Formats a Date using its local Y/M/D components — never round-trips through
 *  UTC (unlike `d.toISOString()`), which would shift the calendar day for
 *  anyone in a timezone behind UTC. */
export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISODate(): string {
  return toISODate(new Date());
}

/** Parses a "YYYY-MM-DD" date-only string as calendar-date parts, without
 *  going through `new Date(string)` (which treats it as UTC midnight and can
 *  shift a day off depending on the runtime's local timezone). */
export function parseISODate(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month: month - 1, day };
}

/** Start/end ISO date strings (inclusive) for the calendar month containing `date`. */
export function getMonthRange(date: Date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start: toISODate(start), end: toISODate(end) };
}

/** Oldest-to-newest list of the last `count` months (including the current one), as {year, month, label}. */
export function getLastNMonths(count: number, from: Date = new Date()) {
  const months: { year: number; month: number; label: string }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(from.getFullYear(), from.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleDateString("en-IN", { month: "short" }),
    });
  }
  return months;
}
