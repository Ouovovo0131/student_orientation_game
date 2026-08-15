import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CHECKPOINTS } from "../assets/checkpoints";
import { CheckpointCard } from "../components/checkpoint/CheckpointCard";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoProgress } from "../components/ui/NeoProgress";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useGame } from "../hooks/useGame";
import { getStageAccessStatus } from "../utils/checkpointAccess";

export function CheckpointListPage() {
  const { player, totalCheckpoints, refreshPlayer, uid } = useGame();
  const location = useLocation();
  const navigate = useNavigate();
  const [focusedStageId, setFocusedStageId] = useState<string | null>(null);

  const search = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const focusStageId = search.get("focus");
  const focusMode = search.get("mode");

  useEffect(() => {
    if (uid) {
      void refreshPlayer();
    }
  }, [refreshPlayer, uid]);

  useEffect(() => {
    if (!focusStageId) {
      return;
    }

    const node = document.getElementById(`checkpoint-card-${focusStageId}`);
    if (!node) {
      return;
    }

    node.scrollIntoView({ behavior: "smooth", block: "center" });
    setFocusedStageId(focusStageId);

    const clearAnimationTimer = window.setTimeout(() => {
      setFocusedStageId(null);
      navigate("/checkpoints", { replace: true });
    }, 1800);

    return () => {
      window.clearTimeout(clearAnimationTimer);
    };
  }, [focusMode, focusStageId, navigate]);

  const score = player?.score ?? 0;

  return (
    <PageContainer>
      <SectionTitle>關卡列表</SectionTitle>
      <NeoProgress value={score} max={totalCheckpoints} />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {CHECKPOINTS.map((checkpoint) => (
          <div key={checkpoint.id} id={`checkpoint-card-${checkpoint.id}`}>
            <CheckpointCard
              checkpoint={checkpoint}
              status={getStageAccessStatus(checkpoint.id, player?.unlockedStages, player?.completedStages)}
              spotlightMode={
                focusedStageId === checkpoint.id
                  ? (focusMode === "locked" ? "locked" : "unlocked")
                  : null
              }
            />
          </div>
        ))}
      </div>
    </PageContainer>
  );
}