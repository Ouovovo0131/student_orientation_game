import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";

export function FinalResultPage() {
  const { player, totalCheckpoints } = useGame();
  const score = player?.score ?? 0;
  const completed = score === totalCheckpoints;

  if (!completed) {
    return (
      <PageContainer className="max-w-2xl">
        <NeoCard className="bg-[#FF6A6A]">
          <h1 className="text-4xl font-black">Challenge Failed</h1>
          <p className="mt-3 text-base">目前分數未達全部關卡，尚未完成挑戰。</p>
          <Link to="/failed" className="mt-6 inline-block">
            <NeoButton variant="secondary">查看失敗說明</NeoButton>
          </Link>
        </NeoCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-2xl">
      <NeoCard className="bg-[#3BEA7D]">
        <h1 className="text-4xl font-black">Challenge Completed</h1>
        <p className="mt-3 text-base">你已完成全部關卡，現在可前往兌換頁面。</p>
        <div className="mt-6">
          <Link to="/redeem">
            <NeoButton>前往兌換</NeoButton>
          </Link>
        </div>
      </NeoCard>
    </PageContainer>
  );
}