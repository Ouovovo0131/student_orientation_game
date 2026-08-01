import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

interface NeoCardProps extends PropsWithChildren {
  className?: string;
}

export function NeoCard({ children, className }: NeoCardProps) {
  return (
    <article
      className={cn(
        "rounded-none border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]",
        className,
      )}
    >
      {children}
    </article>
  );
}