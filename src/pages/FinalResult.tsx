import { Navigate, useNavigate } from "react-router-dom";
import { Award, CheckCircle2, ShieldX } from "lucide-react";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { useGame } from "@/hooks/useGame";

export function FinalResultPage() {
  const navigate = useNavigate();
  const { isComplete, totalCheckpoints, completedCount, isRedeemed } = useGame();

  if (!isComplete) {
    return <Navigate to="/failed" replace />;
  }

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Final result" title="Challenge Completed" description="全部關卡都已完成，現在可以進入 Redeem 流程。" />
      <NeoCard className="space-y-5 p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-neo border-4 border-ink bg-acid shadow-neo">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black">成功達成 {completedCount} / {totalCheckpoints}</h2>
            <p className="text-sm text-black/70">Firestore 中的分數已達標。</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <NeoBadge variant="success">Challenge Completed</NeoBadge>
          <NeoBadge variant={isRedeemed ? "success" : "warning"}>{isRedeemed ? "Already Redeemed" : "可兌換"}</NeoBadge>
        </div>
        <div className="flex flex-wrap gap-3">
          <NeoButton type="button" onClick={() => navigate("/redeem")}>
            <Award className="h-4 w-4" />
            前往兌換
          </NeoButton>
          <NeoButton type="button" variant="ghost" onClick={() => navigate("/checkpoints")}>
            <ShieldX className="h-4 w-4" />
            回顧關卡
          </NeoButton>
        </div>
      </NeoCard>
    </div>
  );
}
