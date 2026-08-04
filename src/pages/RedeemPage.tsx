import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";
import { launchCelebrationConfetti } from "../utils/confetti";

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
            請改到兌換工作台進行開關、設定與名單查閱。
          </p>
          <div className="mt-6">
            <Link to="/admin/redeem">
              <NeoButton>前往兌換工作台</NeoButton>
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
              ? "你還差一點點，完成全部關卡後就會顯示可兌換。"
              : "兌換時段尚未開始，請稍後再回來看看。"}
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
                ? "已送出兌換通知，請等待現場人員引導。"
                : "請按下方按鈕進行兌換。"}
            </p>
          </div>

          {!requested && showRequestButton && (
            <div className="mt-4">
              <NeoButton
                fullWidth
                disabled={loading}
                onClick={async () => {
                  await requestRedeemTicket();
                  launchCelebrationConfetti();
                }}
              >
                {loading ? "送出中..." : "我要兌換獎品"}
              </NeoButton>
            </div>
          )}

          {requested && (
            <div className="mt-4 border-4 border-black bg-[#3BEA7D] p-3 text-center text-base font-black">
              兌換通知已送出，請等待現場人員引導。
            </div>
          )}
        </NeoCard>
      )}
    </PageContainer>
  );
}