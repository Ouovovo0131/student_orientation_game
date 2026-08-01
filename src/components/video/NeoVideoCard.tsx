import { useState } from "react";
import { NeoCard } from "../ui/NeoCard";

interface NeoVideoCardProps {
  title: string;
  description: string;
  videoUrl: string;
  onEnded: () => Promise<void>;
  completed: boolean;
}

export function NeoVideoCard({
  title,
  description,
  videoUrl,
  onEnded,
  completed,
}: NeoVideoCardProps) {
  const [sending, setSending] = useState(false);

  return (
    <NeoCard>
      <h2 className="text-2xl font-black">{title}</h2>
      <p className="mt-2 text-sm">{description}</p>
      <div className="mt-4 overflow-hidden border-4 border-black">
        <video
          className="aspect-video w-full bg-black"
          src={videoUrl}
          controls
          controlsList="nodownload"
          onEnded={async () => {
            if (completed || sending) {
              return;
            }
            setSending(true);
            try {
              await onEnded();
            } finally {
              setSending(false);
            }
          }}
          aria-label={`${title} 影片`}
        />
      </div>
      <p className="mt-3 text-sm font-bold">
        {completed
          ? "此關卡已完成，分數已記錄。"
          : "請完整播放到結束，系統才會自動加分。"}
      </p>
    </NeoCard>
  );
}