import type { PropsWithChildren } from "react";

export function SectionTitle({ children }: PropsWithChildren) {
  return (
    <h2 className="mb-3 inline-block border-b-4 border-black bg-[#FFD644] px-3 py-1 text-xl font-extrabold">
      {children}
    </h2>
  );
}