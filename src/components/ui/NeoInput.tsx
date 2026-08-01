import { cn } from "@/utils/cn";
import type { InputHTMLAttributes, ReactNode } from "react";

type NeoInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  helperText?: ReactNode;
};

export function NeoInput({ label, helperText, className, id, ...props }: NeoInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold">{label}</span>
      <input
        id={id}
        className={cn("w-full rounded-neo border-4 border-ink bg-white px-4 py-3 shadow-neo outline-none transition focus:-translate-y-1", className)}
        {...props}
      />
      {helperText ? <span className="block text-xs text-black/70">{helperText}</span> : null}
    </label>
  );
}
