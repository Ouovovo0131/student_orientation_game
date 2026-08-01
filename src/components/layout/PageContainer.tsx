import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

interface PageContainerProps extends PropsWithChildren {
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn("mx-auto w-full max-w-5xl px-4 pb-28 pt-6 md:px-8", className)}>
      {children}
    </main>
  );
}