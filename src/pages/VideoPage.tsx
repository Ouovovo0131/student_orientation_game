import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoVideoCard } from "../components/video/NeoVideoCard";
import { useCheckpoint } from "../hooks/useCheckpoint";
import { useGame } from "../hooks/useGame";

export function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const checkpoint = useCheckpoint(id);
  const { completeCheckpoint, player } = useGame();

  if (!checkpoint) {
    return (
      <PageContainer>
        <p className="border-4 border-black bg-[#FF6A6A] p-5 text-lg font-black">錯誤：無效的關卡影片頁面。</p>
      </PageContainer>
    );
  }

  const completed = Boolean(player?.completedStages[checkpoint.id]);

  return (
    <PageContainer className="max-w-4xl">
      <NeoVideoCard
        title={checkpoint.title}
        description={checkpoint.description}
        videoUrl={checkpoint.videoUrl}
        completed={completed}
        onEnded={async () => {
          await completeCheckpoint(checkpoint.id);
          navigate(`/completion?stage=${checkpoint.id}`);
        }}
      />
    </PageContainer>
  );
}