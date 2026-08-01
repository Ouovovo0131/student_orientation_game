import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface NeoInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function NeoInput({ label, id, error, className, ...props }: NeoInputProps) {
  const inputId = id ?? label;

  return (
    <label className="block text-left" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-none border-4 border-black bg-white px-4 py-3 text-base shadow-[4px_4px_0_0_#000]",
          "focus:outline-none focus:ring-4 focus:ring-[#FFD644]",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-2 text-sm font-bold text-red-600">{error}</p>}
    </label>
  );
}