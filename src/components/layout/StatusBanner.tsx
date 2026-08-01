import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoCard } from "@/components/ui/NeoCard";
import type { ReactNode } from "react";

type StatusBannerProps = {
  tone?: "info" | "success" | "warning" | "danger";
  title: string;
  description: string;
  tag?: ReactNode;
};

const toneMap: Record<NonNullable<StatusBannerProps["tone"]>, { badge: "info" | "success" | "warning" | "danger"; bg: string }> = {
  info: { badge: "info", bg: "bg-sky/20" },
  success: { badge: "success", bg: "bg-acid/30" },
  warning: { badge: "warning", bg: "bg-gold/30" },
  danger: { badge: "danger", bg: "bg-coral/25" },
};

export function StatusBanner({ tone = "info", title, description, tag }: StatusBannerProps) {
  const style = toneMap[tone];
  return (
    <NeoCard className={`p-4 ${style.bg}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <NeoBadge variant={style.badge}>{tone.toUpperCase()}</NeoBadge>
            {tag}
          </div>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="text-sm leading-6 text-black/75">{description}</p>
        </div>
      </div>
    </NeoCard>
  );
}
