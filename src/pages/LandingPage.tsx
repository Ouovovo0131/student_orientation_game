import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useGame } from "../hooks/useGame";

export function LandingPage() {
  const { uid } = useGame();

  return (
    <PageContainer>
      <NeoCard className="bg-[#FFD644]">
        <SectionTitle>新生闖關挑戰</SectionTitle>
        <h1 className="mt-2 text-4xl font-black leading-tight">看完每一支影片，解鎖你的入學徽章</h1>
        <p className="mt-4 max-w-2xl text-base">
          每個關卡都有一段重要校園資訊影片。只有完整播放到結束，系統才會自動記錄該關分數。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {!uid && (
            <Link to="/login">
              <NeoButton>登入</NeoButton>
            </Link>
          )}
          {uid && (
            <Link to="/checkpoints">
              <NeoButton>開始闖關</NeoButton>
            </Link>
          )}
          <Link to="/map">
            <NeoButton variant="secondary">查看地圖</NeoButton>
          </Link>
        </div>
      </NeoCard>
    </PageContainer>
  );
}