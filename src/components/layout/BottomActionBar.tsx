import type { PropsWithChildren } from "react";

export function BottomActionBar({ children }: PropsWithChildren) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t-4 border-black bg-[#FFF6D6] p-4">
      <div className="mx-auto max-w-5xl">{children}</div>
    </div>
  );
}