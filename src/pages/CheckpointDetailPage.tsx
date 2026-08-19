import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoBadge } from "../components/ui/NeoBadge";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useCheckpoint } from "../hooks/useCheckpoint";
import { useGame } from "../hooks/useGame";
import { getStageAccessStatus } from "../utils/checkpointAccess";

export function CheckpointDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const checkpoint = useCheckpoint(id);
  const { player } = useGame();

  if (!checkpoint) {
    return (
      <PageContainer>
        <NeoCard>
          <h1 className="text-2xl font-black">找不到關卡</h1>
          <p className="mt-2">請掃描該關卡的QR Code後解鎖關卡。</p>
        </NeoCard>
      </PageContainer>
    );
  }

  const completed = Boolean(player?.completedStages[checkpoint.id]);
  const stageStatus = getStageAccessStatus(checkpoint.id, player?.unlockedStages, player?.completedStages);

  if (stageStatus === "locked") {
    return <Navigate to={`/checkpoints?focus=${checkpoint.id}&mode=locked`} replace />;
  }

  return (
    <PageContainer className="max-w-3xl">
      <NeoButton
        type="button"
        variant="secondary"
        className="mb-4 px-4 py-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-1 inline" size={18} />
        返回上一頁
      </NeoButton>
      <NeoCard>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-black">{checkpoint.title}</h1>
          <NeoBadge tone={completed ? "success" : "warning"}>
            {completed ? "已完成" : "待完成"}
          </NeoBadge>
        </div>
        <p className="mt-4 text-base">{checkpoint.description}</p>
        {completed ? (
          <>
            <div className="mt-4 border-l-4 border-black bg-[#E8FFF1] p-3 text-sm font-bold">
              已完成本關，這裡顯示的是關卡摘要。
            </div>
            {checkpoint.quiz && (
              <div className="mt-4 border-4 border-black bg-white p-4 text-sm">
                <p className="font-black">快問快答摘要</p>
                <p className="mt-2">題目：{checkpoint.quiz.prompt}</p>
                <p className="mt-2">正確答案：{checkpoint.quiz.options[checkpoint.quiz.answerIndex]}</p>
                <p className="mt-2 font-bold">重點說明：{checkpoint.quiz.explanation}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mt-4 border-l-4 border-black bg-[#8DD8FF] p-3 text-sm font-bold">
              分數規則：影片完整播放至結尾後，系統才會自動提交完成，不可手動領分。
            </p>
            <Link to={`/video/${checkpoint.id}`} className="mt-6 inline-block">
              <NeoButton>
                進入影片闖關 <ArrowRight className="ml-1 inline" size={18} />
              </NeoButton>
            </Link>
          </>
        )}
      </NeoCard>
    </PageContainer>
  );
}