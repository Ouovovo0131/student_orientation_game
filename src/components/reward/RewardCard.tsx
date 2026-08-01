import { Gift } from "lucide-react";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoCard } from "@/components/ui/NeoCard";

type RewardCardProps = {
  title: string;
  description: string;
  unlocked: boolean;
};

export function RewardCard({ title, description, unlocked }: RewardCardProps) {
  return (
    <NeoCard className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-neo border-4 border-ink bg-gold shadow-neo">
          <Gift className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black">{title}</h3>
            <NeoBadge variant={unlocked ? "success" : "warning"}>{unlocked ? "已解鎖" : "鎖定中"}</NeoBadge>
          </div>
          <p className="text-sm leading-6 text-black/75">{description}</p>
        </div>
      </div>
    </NeoCard>
  );
}
