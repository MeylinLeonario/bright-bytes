import { cn } from "@/lib/utils";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakCalendar({ activity }: { activity: Array<{ date: string; intensity: number }> }) {
  const byDate = new Map(activity.map((item) => [item.date.slice(0, 10), item.intensity]));
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);
  start.setDate(end.getDate() - 83 - ((end.getDay() + 6) % 7));
  const days = Array.from({ length: 91 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return { date, key, intensity: byDate.get(key) ?? 0, future: date > end };
  });

  const intensityClass = ["bg-muted", "bg-primary/25", "bg-primary/65", "bg-primary"];

  return (
    <div className="overflow-x-auto pb-1">
      <div className="grid w-max grid-flow-col grid-rows-7 gap-1.5" aria-label="Study activity from the last 13 weeks">
        {days.map(({ date, key, intensity, future }, index) => (
          <div
            key={key}
            title={`${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${intensity === 0 ? "No activity" : intensity === 1 ? "Lesson opened" : intensity === 2 ? "One practice completed" : "Writing and speaking completed"}`}
            className={cn("size-3.5 rounded-[3px] ring-1 ring-inset ring-border/40 sm:size-4", future ? "opacity-0" : intensityClass[intensity])}>
            {index < 7 && <span className="sr-only">{DAY_LABELS[index]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}