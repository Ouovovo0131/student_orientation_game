import { useNavigate } from "react-router-dom";
import { CheckpointCard } from "@/components/checkpoint/CheckpointCard";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoProgress } from "@/components/ui/NeoProgress";
import { RewardCard } from "@/components/reward/RewardCard";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { useGame } from "@/hooks/useGame";

export function CheckpointListPage() {
  const navigate = useNavigate();
  const { checkpoints, completedIds, completedCount, totalCheckpoints, nextCheckpoint } = useGame();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionTitle
          eyebrow="Checkpoint list"
          title="依序完成每個影片節點。"
          description="每一個關卡都有標題、說明與影片。只有看完影片後，才能正式把該關卡算進完成數。"
        />
        <NeoProgress value={completedCount} max={totalCheckpoints} label="任務完成度" />
        <div className="flex flex-wrap gap-2">
          <NeoBadge variant="info">下一關：{nextCheckpoint ? nextCheckpoint.title : "全部完成"}</NeoBadge>
          <NeoBadge variant="success">已完成 {completedCount} / {totalCheckpoints}</NeoBadge>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]">
        <div className="grid gap-4">
          {checkpoints.map((checkpoint) => (
            <CheckpointCard
              key={checkpoint.id}
              checkpoint={checkpoint}
              completed={completedIds.includes(checkpoint.id)}
              onOpen={() => navigate(`/checkpoints/${checkpoint.id}`)}
              onWatch={() => navigate(`/checkpoints/${checkpoint.id}/video`)}
            />
          ))}
        </div>
        <RewardCard
          title="最終兌換資格"
          description="五個關卡全部完成後，Redeem 頁面就會顯示可兌換狀態；一旦完成兌換，之後會永久顯示 Already Redeemed。"
          unlocked={completedCount === totalCheckpoints}
        />
      </div>
    </div>
  );
}
