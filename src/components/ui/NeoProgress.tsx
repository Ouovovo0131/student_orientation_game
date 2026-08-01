import { cn } from "@/utils/cn";

type NeoProgressProps = {
  value: number;
  max: number;
  label?: string;
  className?: string;
};

export function NeoProgress({ value, max, label, className }: NeoProgressProps) {
  const percent = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between text-sm font-bold">
          <span>{label}</span>
          <span>{Math.round(percent)}%</span>
        </div>
      ) : null}
      <div className="h-5 overflow-hidden rounded-full border-4 border-ink bg-white shadow-neo">
        <div className="h-full rounded-full bg-acid transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
