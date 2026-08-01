import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { RewardCard } from "../components/reward/RewardCard";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";

export function RedeemPage() {
  const navigate = useNavigate();
  const { player, totalCheckpoints, redeemReward, loading } = useGame();

  const score = player?.score ?? 0;
  const eligible = score === totalCheckpoints;
  const redeemed = Boolean(player?.isRedeemed);

  useEffect(() => {
    if (redeemed) {
      navigate("/redeemed");
    }
  }, [redeemed, navigate]);

  if (redeemed) return null;

  return (
    <PageContainer className="max-w-2xl">
      <RewardCard
        title="實體獎勵兌換"
        description="請先確認工作人員已引導你掃描正確 QR Code，再進行兌換。"
        eligible={eligible}
        redeemed={redeemed}
      />

      {!eligible && (
        <NeoCard className="mt-4 bg-[#FF6A6A]">
          <h2 className="text-2xl font-black">Not Eligible</h2>
          <p className="mt-2">你的分數尚未達到全部關卡，無法進行兌換。</p>
        </NeoCard>
      )}

      {eligible && (
        <div className="mt-4">
          <NeoButton
            fullWidth
            disabled={loading}
            onClick={async () => {
              await redeemReward();
              navigate("/redeemed");
            }}
          >
            {loading ? "兌換處理中..." : "Redeem Now"}
          </NeoButton>
        </div>
      )}
    </PageContainer>
  );
}