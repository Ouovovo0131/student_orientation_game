import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";
import { useState } from "react";

export function RedeemPage() {
  const navigate = useNavigate();
  const { player, totalCheckpoints, requestRedeemTicket, redeemControl, loading } = useGame();
  const [showRequestButton, setShowRequestButton] = useState(false);

  const score = player?.score ?? 0;
  const eligible = score >= totalCheckpoints;
  const redeemed = Boolean(player?.isRedeemed);
  const requested = Boolean(player?.redeemRequested);
  const isAdmin = player?.role === "admin";
  const canRedeemNow = eligible && redeemControl.isOpen && !redeemed;

  useEffect(() => {
    if (redeemed && !isAdmin) {
      navigate("/redeemed");
    }
  }, [redeemed, isAdmin, navigate]);

  useEffect(() => {
    if (!canRedeemNow || requested) {
      setShowRequestButton(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowRequestButton(true);
    }, 1300);

    return () => {
      clearTimeout(timer);
    };
  }, [canRedeemNow, requested]);

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
      {!canRedeemNow && (
        <NeoCard className="bg-[#FFE48F]">
          <h1 className="text-3xl font-black">目前不可兌換</h1>
          <p className="mt-3 text-base">
            {!eligible
              ? "你尚未完成全部關卡，完成後系統會自動顯示可兌換狀態。"
              : "管理員尚未開啟兌換，請稍後再回來查看。"}
          </p>
        </NeoCard>
      )}

      {canRedeemNow && (
        <NeoCard className="bg-[#E8FFF1]">
          <div className="relative overflow-hidden border-4 border-black bg-white p-5">
            {!requested && (
              <div className="pointer-events-none absolute inset-0">
                <span className="confetti-piece left-[8%] bg-[#ff6a6a]" />
                <span className="confetti-piece left-[20%] bg-[#ffd644] [animation-delay:0.1s]" />
                <span className="confetti-piece left-[34%] bg-[#3bea7d] [animation-delay:0.22s]" />
                <span className="confetti-piece left-[48%] bg-[#8dd8ff] [animation-delay:0.3s]" />
                <span className="confetti-piece left-[60%] bg-[#ff9f1a] [animation-delay:0.4s]" />
                <span className="confetti-piece left-[72%] bg-[#ff6a6a] [animation-delay:0.52s]" />
                <span className="confetti-piece left-[84%] bg-[#3bea7d] [animation-delay:0.62s]" />
              </div>
            )}

            <h1 className="relative text-3xl font-black">你可以兌換獎品了</h1>
            <p className="relative mt-3 text-base">
              {requested
                ? "已送出可兌換通知，請向工作人員出示此畫面。"
                : "系統已判定你可兌換，請按下按鈕通知管理員你的帳號。"}
            </p>

            {redeemControl.qrCodeUrl && (
              <img
                src={redeemControl.qrCodeUrl}
                alt="兌換 QR Code"
                className="relative mt-4 w-full max-w-xs border-4 border-black bg-white p-2"
              />
            )}
          </div>

          {!requested && showRequestButton && (
            <div className="mt-4">
              <NeoButton
                fullWidth
                disabled={loading}
                onClick={async () => {
                  await requestRedeemTicket();
                }}
              >
                {loading ? "通知中..." : "通知管理員：我可兌換"}
              </NeoButton>
            </div>
          )}

          {requested && (
            <div className="mt-4 border-4 border-black bg-[#3BEA7D] p-3 text-center text-base font-black">
              已通知管理員，請等待叫號或人工核對。
            </div>
          )}
        </NeoCard>
      )}
    </PageContainer>
  );
}