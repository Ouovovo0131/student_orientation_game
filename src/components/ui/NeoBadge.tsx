import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

interface NeoBadgeProps extends PropsWithChildren {
  tone?: "success" | "warning" | "info";
  className?: string;
}

const toneMap = {
  success: "bg-[#3BEA7D]",
  warning: "bg-[#FFD644]",
  info: "bg-[#8DD8FF]",
};

export function NeoBadge({ children, tone = "info", className }: NeoBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none border-2 border-black px-3 py-1 text-sm font-bold",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}