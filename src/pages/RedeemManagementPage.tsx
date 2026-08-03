import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoBadge } from "../components/ui/NeoBadge";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { NeoInput } from "../components/ui/NeoInput";
import { useGame } from "../hooks/useGame";
import { getRedeemStats } from "../services/gameApi";
import type { RedeemStats } from "../types";

const EMPTY_STATS: RedeemStats = {
  totalPlayers: 0,
  eligiblePlayers: 0,
  ineligiblePlayers: 0,
  redeemedPlayers: 0,
  waitingRedeemPlayers: 0,
};

export function RedeemManagementPage() {
  const { uid, player, redeemControl, setRedeemControl, loading, totalCheckpoints } = useGame();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [stats, setStats] = useState<RedeemStats>(EMPTY_STATS);
  const [statsLoading, setStatsLoading] = useState(false);
  const isAdmin = player?.role === "admin";

  useEffect(() => {
    setQrCodeUrl(redeemControl.qrCodeUrl ?? "");
  }, [redeemControl.qrCodeUrl]);

  const refreshStats = async () => {
    if (!uid || !isAdmin) {
      return;
    }

    setStatsLoading(true);
    try {
      const next = await getRedeemStats(uid, totalCheckpoints);
      setStats(next);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    void refreshStats();
  }, [uid, isAdmin, totalCheckpoints]);

  if (!isAdmin) {
    return (
      <PageContainer className="max-w-2xl">
        <NeoCard className="bg-[#FFE48F]">
          <h1 className="text-3xl font-black">此頁僅限管理員</h1>
          <p className="mt-3 text-base">你目前不是管理員，請返回玩家兌換頁面。</p>
          <div className="mt-6">
            <Link to="/redeem">
              <NeoButton variant="secondary">前往玩家兌換頁</NeoButton>
            </Link>
          </div>
        </NeoCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-3xl">
      <NeoCard className="bg-[#E8F2FF]">
        <h1 className="text-3xl font-black">兌換管理頁面</h1>
        <p className="mt-2 text-sm">
          此頁會一直保留給管理員使用，和玩家兌換頁面不同。
          玩家使用 /redeem；管理員請使用 /admin/redeem。
        </p>
      </NeoCard>

      <NeoCard className="mt-4">
        <h2 className="text-2xl font-black">開啟兌換會有什麼效果？</h2>
        <div className="mt-3 space-y-2 text-sm">
          <p>1. 玩家在兌換頁面會看到「可執行兌換」按鈕。</p>
          <p>2. 玩家若已完成全部關卡，可由工作人員引導完成兌換確認。</p>
          <p>3. 關閉兌換後，玩家仍可看到說明與 QR Code，但無法送出兌換。</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <NeoBadge tone={redeemControl.isOpen ? "success" : "warning"}>
            {redeemControl.isOpen ? "目前狀態：已開啟兌換" : "目前狀態：已關閉兌換"}
          </NeoBadge>
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
            {redeemControl.isOpen ? "立即關閉兌換" : "立即開啟兌換"}
          </NeoButton>
        </div>
      </NeoCard>

      <NeoCard className="mt-4">
        <h2 className="text-2xl font-black">現場 QR Code 設定</h2>
        <p className="mt-2 text-sm">可貼上要給玩家出示的圖片網址，儲存後玩家頁面會同步顯示。</p>
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

      <NeoCard className="mt-4 bg-[#F4FFF6]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">兌換統計</h2>
          <NeoButton variant="secondary" disabled={statsLoading} onClick={refreshStats}>
            {statsLoading ? "更新中..." : "重新整理統計"}
          </NeoButton>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <NeoBadge tone="info">玩家總數：{stats.totalPlayers}</NeoBadge>
          <NeoBadge tone="success">可兌獎人數：{stats.eligiblePlayers}</NeoBadge>
          <NeoBadge tone="warning">無法兌獎人數：{stats.ineligiblePlayers}</NeoBadge>
          <NeoBadge tone="info">已兌獎人數：{stats.redeemedPlayers}</NeoBadge>
          <NeoBadge tone="success">待兌獎人數：{stats.waitingRedeemPlayers}</NeoBadge>
        </div>
      </NeoCard>
    </PageContainer>
  );
}
