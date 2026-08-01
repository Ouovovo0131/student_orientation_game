import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { NeoVideoCard } from "@/components/video/NeoVideoCard";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { useGame } from "@/hooks/useGame";

export function VideoPage() {
  const { checkpointId } = useParams();
  const navigate = useNavigate();
  const { checkpoints, completeCheckpoint, completedIds, totalCheckpoints, completedCount } = useGame();
  const [saving, setSaving] = useState(false);
  const checkpoint = checkpoints.find((item) => item.id === checkpointId);

  if (!checkpoint) {
    return <Navigate to="/404" replace />;
  }

  async function handleEnded() {
    if (saving || completedIds.includes(checkpoint.id)) {
      navigate(`/completion/${checkpoint.id}`);
      return;
    }

    setSaving(true);
    try {
      await completeCheckpoint(checkpoint.id);
    } finally {
      setSaving(false);
    }
    navigate(`/completion/${checkpoint.id}`);
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Video"
        title={`第 ${checkpoint.order} 關影片`}
        description={`完成後會自動更新分數。進度：${completedCount} / ${totalCheckpoints}`}
      />
      <NeoVideoCard
        title={checkpoint.title}
        description={checkpoint.description}
        videoUrl={checkpoint.videoUrl}
        onEnded={() => void handleEnded()}
      />
    </div>
  );
}
