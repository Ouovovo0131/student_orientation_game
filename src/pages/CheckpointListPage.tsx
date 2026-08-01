import { useEffect } from "react";
import { CHECKPOINTS } from "../assets/checkpoints";
import { CheckpointCard } from "../components/checkpoint/CheckpointCard";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoProgress } from "../components/ui/NeoProgress";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useGame } from "../hooks/useGame";

export function CheckpointListPage() {
  const { player, totalCheckpoints, refreshPlayer, uid } = useGame();

  useEffect(() => {
    if (uid) {
      void refreshPlayer();
    }
  }, [refreshPlayer, uid]);

  const score = player?.score ?? 0;

  return (
    <PageContainer>
      <SectionTitle>關卡列表</SectionTitle>
      <NeoProgress value={score} max={totalCheckpoints} />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {CHECKPOINTS.map((checkpoint) => (
          <CheckpointCard
            key={checkpoint.id}
            checkpoint={checkpoint}
            completed={Boolean(player?.completedStages[checkpoint.id])}
          />
        ))}
      </div>
    </PageContainer>
  );
}