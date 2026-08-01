import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { useGame } from "@/hooks/useGame";

export function CheckpointDetailPage() {
  const { checkpointId } = useParams();
  const navigate = useNavigate();
  const { checkpoints, completedIds } = useGame();
  const checkpoint = checkpoints.find((item) => item.id === checkpointId);

  if (!checkpoint) {
    return <Navigate to="/404" replace />;
  }

  const completed = completedIds.includes(checkpoint.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div className="space-y-4">
        <SectionTitle title={checkpoint.title} description={checkpoint.description} />
        <div className="flex flex-wrap gap-2">
          <NeoBadge variant={completed ? "success" : "warning"}>{completed ? "已完成" : "尚未完成"}</NeoBadge>
          <NeoBadge variant="info">獎勵：{checkpoint.rewardLabel}</NeoBadge>
        </div>
      </div>

      <NeoCard className="space-y-4 p-6">
        <div className="rounded-neo border-4 border-ink bg-acid p-4 shadow-neo">
          <CheckCircle2 className="h-8 w-8" />
          <p className="mt-3 text-sm font-bold leading-6">只有影片播完才會呼叫完成流程，不能手動跳過。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <NeoButton type="button" onClick={() => navigate(`/checkpoints/${checkpoint.id}/video`)}>
            <Play className="h-4 w-4" />
            去看影片
          </NeoButton>
          <NeoButton type="button" variant="ghost" onClick={() => navigate("/checkpoints")}>
            <ArrowRight className="h-4 w-4" />
            回列表
          </NeoButton>
        </div>
      </NeoCard>
    </div>
  );
}
