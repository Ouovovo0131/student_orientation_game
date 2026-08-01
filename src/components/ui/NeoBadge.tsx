import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

type NeoBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
};

const badgeClasses = {
  default: "bg-white",
  success: "bg-acid",
  warning: "bg-gold",
  danger: "bg-coral",
  info: "bg-sky",
};

export function NeoBadge({ variant = "default", className, children, ...props }: NeoBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border-2 border-ink px-3 py-1 text-xs font-bold", badgeClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
