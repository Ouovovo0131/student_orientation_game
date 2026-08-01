import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { RewardCard } from "../components/reward/RewardCard";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { NeoInput } from "../components/ui/NeoInput";
import { useGame } from "../hooks/useGame";

export function RedeemPage() {
  const navigate = useNavigate();
  const { player, totalCheckpoints, redeemReward, redeemControl, setRedeemControl, loading } = useGame();
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const score = player?.score ?? 0;
  const eligible = score === totalCheckpoints;
  const redeemed = Boolean(player?.isRedeemed);
  const isAdmin = player?.role === "admin";

  useEffect(() => {
    setQrCodeUrl(redeemControl.qrCodeUrl ?? "");
  }, [redeemControl.qrCodeUrl]);

  useEffect(() => {
    if (redeemed) {
      navigate("/redeemed");
    }
  }, [redeemed, navigate]);

  if (redeemed) return null;

  return (
    <PageContainer className="max-w-2xl">
      {isAdmin && (
        <NeoCard className="mb-4 bg-[#E8F2FF]">
          <h2 className="text-2xl font-black">管理員控制台</h2>
          <p className="mt-2 text-sm">你可以在此開啟或關閉玩家兌換，並設定現場展示的 QR Code。</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <NeoButton
              variant={redeemControl.isOpen ? "danger" : "primary"}
              disabled={loading}
              onClick={async () => {
                await setRedeemControl({
                  isOpen: !redeemControl.isOpen,
                  qrCodeUrl: qrCodeUrl || null,
                });
              }}
            >
              {redeemControl.isOpen ? "關閉兌換" : "開啟兌換"}
            </NeoButton>
          </div>
          <div className="mt-4">
            <NeoInput
              label="兌換 QR Code 圖片網址"
              value={qrCodeUrl}
              onChange={(event) => setQrCodeUrl(event.target.value)}
              placeholder="https://example.com/redeem-qr.png"
            />
          </div>
          <div className="mt-4">
            <NeoButton
              variant="secondary"
              disabled={loading}
              onClick={async () => {
                await setRedeemControl({
                  isOpen: redeemControl.isOpen,
                  qrCodeUrl: qrCodeUrl || null,
                });
              }}
            >
              儲存 QR Code 設定
            </NeoButton>
          </div>
        </NeoCard>
      )}

      <RewardCard
        title="實體獎勵兌換"
        description="請先確認工作人員已引導你掃描正確 QR Code，再進行兌換。"
        eligible={eligible}
        redeemed={redeemed}
      />

      {!redeemControl.isOpen && (
        <NeoCard className="mt-4 bg-[#FFE48F]">
          <h2 className="text-2xl font-black">兌換尚未開放</h2>
          <p className="mt-2">目前管理員尚未開啟兌換，請等待現場工作人員操作。</p>
        </NeoCard>
      )}

      {redeemControl.qrCodeUrl && (
        <NeoCard className="mt-4">
          <h2 className="text-2xl font-black">現場兌換 QR Code</h2>
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
            {loading ? "兌換處理中..." : "Redeem Now"}
          </NeoButton>
        </div>
      )}
    </PageContainer>
  );
}