import { NeoBadge } from "../ui/NeoBadge";
import { NeoCard } from "../ui/NeoCard";

interface RewardCardProps {
  title: string;
  description: string;
  eligible: boolean;
  redeemed: boolean;
}

export function RewardCard({ title, description, eligible, redeemed }: RewardCardProps) {
  return (
    <NeoCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="mt-2 text-sm">{description}</p>
        </div>
        <NeoBadge tone={redeemed ? "info" : eligible ? "success" : "warning"}>
          {redeemed ? "已兌換" : eligible ? "可兌換" : "未達資格"}
        </NeoBadge>
      </div>
    </NeoCard>
  );
}