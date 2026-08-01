import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type NeoButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

const variantClasses: Record<NonNullable<NeoButtonProps["variant"]>, string> = {
  primary: "bg-acid text-ink",
  secondary: "bg-sky text-ink",
  ghost: "bg-white text-ink",
  danger: "bg-coral text-ink",
};

const sizeClasses: Record<NonNullable<NeoButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export function NeoButton({ variant = "primary", size = "md", className, children, ...props }: NeoButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-neo border-4 border-ink font-bold shadow-neo transition-transform duration-150 hover:-translate-y-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
