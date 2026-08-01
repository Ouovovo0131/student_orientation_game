import { useNavigate } from "react-router-dom";
import { Gift, RotateCw, Ticket } from "lucide-react";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { useGame } from "@/hooks/useGame";

export function RedeemPage() {
  const navigate = useNavigate();
  const { isComplete, totalCheckpoints, completedCount, isRedeemed, redeemChallenge } = useGame();

  async function handleRedeem() {
    await redeemChallenge();
    navigate("/redeemed");
  }

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Redeem" title="掃描 QR Code 後兌換獎勵。" description="只要分數達標且尚未兌換，就會看到 Redeem Now；完成後會永久改成 Already Redeemed。" />
      <NeoCard className="space-y-5 p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-neo border-4 border-ink bg-gold shadow-neo">
            <Ticket className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">目前狀態</h2>
            <div className="flex flex-wrap gap-2">
              <NeoBadge variant={isComplete ? "success" : "warning"}>{isComplete ? "已達標" : "未達標"}</NeoBadge>
              <NeoBadge variant={isRedeemed ? "success" : "warning"}>{isRedeemed ? "Already Redeemed" : "Not Redeemed"}</NeoBadge>
            </div>
            <p className="text-sm leading-6 text-black/70">目前分數：{completedCount} / {totalCheckpoints}</p>
          </div>
        </div>

        {!isComplete ? (
          <div className="rounded-neo border-4 border-ink bg-coral p-5 shadow-neo">
            <p className="font-bold">Not eligible</p>
            <p className="text-sm leading-6">必須先完成所有 checkpoint 才能進入兌換流程。</p>
          </div>
        ) : isRedeemed ? (
          <div className="rounded-neo border-4 border-ink bg-acid p-5 shadow-neo">
            <p className="font-bold">Already Redeemed</p>
            <p className="text-sm leading-6">你已經完成兌換，狀態會永久保持。</p>
          </div>
        ) : (
          <div className="rounded-neo border-4 border-ink bg-acid p-5 shadow-neo">
            <p className="font-bold">Redeem Now</p>
            <p className="text-sm leading-6">提交 Firestore transaction 後，狀態會立即切換為已兌換。</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <NeoButton type="button" onClick={handleRedeem} disabled={!isComplete || isRedeemed}>
            <Gift className="h-4 w-4" />
            Redeem Now
          </NeoButton>
          <NeoButton type="button" variant="ghost" onClick={() => navigate("/checkpoints")}>
            <RotateCw className="h-4 w-4" />
            回到關卡
          </NeoButton>
        </div>
      </NeoCard>
    </div>
  );
}
