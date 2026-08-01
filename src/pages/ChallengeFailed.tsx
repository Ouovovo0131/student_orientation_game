import { useNavigate } from "react-router-dom";
import { AlertTriangle, RotateCw } from "lucide-react";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { useGame } from "@/hooks/useGame";

export function ChallengeFailedPage() {
  const navigate = useNavigate();
  const { completedCount, totalCheckpoints, nextCheckpoint } = useGame();

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Challenge failed" title="Challenge Failed" description="目前分數還沒達到所有 checkpoint 的總數，請回到關卡列表補齊進度。" />
      <NeoCard className="space-y-5 p-7">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-neo border-4 border-ink bg-coral shadow-neo">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">目前完成 {completedCount} / {totalCheckpoints}</h2>
            <NeoBadge variant="warning">下一關：{nextCheckpoint ? nextCheckpoint.title : "無"}</NeoBadge>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <NeoButton type="button" onClick={() => navigate("/checkpoints")}>
            <RotateCw className="h-4 w-4" />
            回到關卡
          </NeoButton>
        </div>
      </NeoCard>
    </div>
  );
}
