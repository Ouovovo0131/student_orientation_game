import { useNavigate } from "react-router-dom";
import { BadgeCheck, ArrowLeft } from "lucide-react";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { useGame } from "@/hooks/useGame";

export function AlreadyRedeemedPage() {
  const navigate = useNavigate();
  const { isRedeemed } = useGame();

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Redeemed" title="Already Redeemed" description="這個狀態會持續保留，讓 QR code 之後再次掃描時也能直接辨識。" />
      <NeoCard className="space-y-4 p-7">
        <div className="flex h-16 w-16 items-center justify-center rounded-neo border-4 border-ink bg-acid shadow-neo">
          <BadgeCheck className="h-8 w-8" />
        </div>
        <p className="text-sm leading-6 text-black/75">目前狀態：{isRedeemed ? "Already Redeemed" : "未兌換"}</p>
        <NeoButton type="button" variant="ghost" onClick={() => navigate("/checkpoints")}>
          <ArrowLeft className="h-4 w-4" />
          返回關卡
        </NeoButton>
      </NeoCard>
    </div>
  );
}
