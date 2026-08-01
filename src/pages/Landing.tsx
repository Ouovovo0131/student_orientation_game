import { useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, Video, WalletCards } from "lucide-react";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { useGame } from "@/hooks/useGame";

export function LandingPage() {
  const navigate = useNavigate();
  const { totalCheckpoints, completedCount, isComplete, source } = useGame();

  return (
    <PageContainer className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <NeoBadge variant={source === "firebase" ? "success" : "warning"}>Neo Brutalism · Checkpoint Game</NeoBadge>
          <SectionTitle
            title="完成影片關卡，讓分數真正入帳。"
            description="這是一個以 Firestore 為真實來源的校園任務體驗。只有在影片播完後才會加 1 分，最後才能進入兌換流程。"
          />
          <div className="flex flex-wrap gap-3">
            <NeoButton type="button" size="lg" onClick={() => navigate("/login")}>
              開始遊戲
              <ArrowRight className="h-5 w-5" />
            </NeoButton>
            <NeoButton type="button" variant="ghost" size="lg" onClick={() => navigate("/checkpoints")}>
              先看關卡
            </NeoButton>
          </div>
        </div>

        <NeoCard className="p-6">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-neo border-4 border-ink bg-acid p-4 shadow-neo">
              <Video className="h-6 w-6" />
              <p className="mt-3 text-3xl font-black">{totalCheckpoints}</p>
              <p className="text-sm font-bold">個影片關卡</p>
            </div>
            <div className="rounded-neo border-4 border-ink bg-sky p-4 shadow-neo">
              <BadgeCheck className="h-6 w-6" />
              <p className="mt-3 text-3xl font-black">{completedCount}</p>
              <p className="text-sm font-bold">已完成</p>
            </div>
            <div className="rounded-neo border-4 border-ink bg-gold p-4 shadow-neo">
              <WalletCards className="h-6 w-6" />
              <p className="mt-3 text-3xl font-black">{isComplete ? "OK" : "WAIT"}</p>
              <p className="text-sm font-bold">{isComplete ? "可兌換" : "尚未完成"}</p>
            </div>
          </div>
        </NeoCard>
      </section>
    </PageContainer>
  );
}
