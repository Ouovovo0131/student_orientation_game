import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

type NeoCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function NeoCard({ className, children, ...props }: NeoCardProps) {
  return (
    <div className={cn("rounded-neo border-4 border-ink bg-white shadow-neo", className)} {...props}>
      {children}
    </div>
  );
}
