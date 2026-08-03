import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { RewardCard } from "../components/reward/RewardCard";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";

export function RedeemPage() {
  const navigate = useNavigate();
  const { player, totalCheckpoints, redeemReward, redeemControl, loading } = useGame();

  const score = player?.score ?? 0;
  const eligible = score === totalCheckpoints;
  const redeemed = Boolean(player?.isRedeemed);
  const isAdmin = player?.role === "admin";

  useEffect(() => {
    if (redeemed && !isAdmin) {
      navigate("/redeemed");
    }
  }, [redeemed, isAdmin, navigate]);

  if (redeemed && !isAdmin) return null;

  if (isAdmin) {
    return (
      <PageContainer className="max-w-2xl">
        <NeoCard className="bg-[#E8F2FF]">
          <h1 className="text-3xl font-black">這是玩家兌換頁面</h1>
          <p className="mt-3 text-base">
            管理員請改用獨立的兌換管理頁面進行開關、QR 設定與統計查閱。
          </p>
          <div className="mt-6">
            <Link to="/admin/redeem">
              <NeoButton>前往管理兌換頁</NeoButton>
            </Link>
          </div>
        </NeoCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-2xl">
      <RewardCard
        title="實體獎勵兌換"
        description="請依照下方步驟，由工作人員確認後再完成兌換。"
        eligible={eligible}
        redeemed={redeemed}
      />

      <NeoCard className="mt-4 bg-[#E8F2FF]">
        <h2 className="text-2xl font-black">兌換流程指示</h2>
        <div className="mt-3 space-y-2 text-sm">
          <p>1. 先確認你已完成所有關卡。</p>
          <p>2. 到服務台出示本頁，依工作人員指示掃描或出示現場 QR Code。</p>
          <p>3. 由工作人員核對完成後，再按下頁面最下方的兌換按鈕。</p>
        </div>
      </NeoCard>

      {!redeemControl.isOpen && (
        <NeoCard className="mt-4 bg-[#FFE48F]">
          <h2 className="text-2xl font-black">兌換尚未開放</h2>
          <p className="mt-2">目前管理員尚未開啟兌換，請等待現場工作人員操作。</p>
        </NeoCard>
      )}

      {redeemControl.qrCodeUrl && (
        <NeoCard className="mt-4">
          <h2 className="text-2xl font-black">現場兌換 QR Code</h2>
          <p className="mt-2 text-sm">請將此畫面出示給工作人員，由工作人員引導你完成兌換流程。</p>
          <img
            src={redeemControl.qrCodeUrl}
            alt="兌換 QR Code"
            className="mt-3 w-full max-w-xs border-4 border-black bg-white p-2"
          />
        </NeoCard>
      )}

      {!eligible && (
        <NeoCard className="mt-4 bg-[#FF6A6A]">
          <h2 className="text-2xl font-black">Not Eligible</h2>
          <p className="mt-2">你的分數尚未達到全部關卡，無法進行兌換。</p>
        </NeoCard>
      )}

      {eligible && redeemControl.isOpen && (
        <div className="mt-4">
          <NeoButton
            fullWidth
            disabled={loading}
            onClick={async () => {
              await redeemReward();
              navigate("/redeemed");
            }}
          >
            {loading ? "兌換處理中..." : "已由工作人員核對，完成兌換"}
          </NeoButton>
        </div>
      )}
    </PageContainer>
  );
}