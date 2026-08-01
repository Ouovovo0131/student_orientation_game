import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "danger";

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantMap: Record<Variant, string> = {
  primary: "bg-[#3BEA7D] text-black",
  secondary: "bg-[#FFD644] text-black",
  danger: "bg-[#FF6A6A] text-black",
};

export function NeoButton({
  className,
  variant = "primary",
  fullWidth,
  ...props
}: NeoButtonProps) {
  return (
    <button
      className={cn(
        "min-h-12 rounded-none border-4 border-black px-5 py-3 text-base font-bold transition active:translate-x-[4px] active:translate-y-[4px]",
        "shadow-[6px_6px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-60",
        variantMap[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}