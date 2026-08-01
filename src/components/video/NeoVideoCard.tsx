import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoCard } from "@/components/ui/NeoCard";

type NeoVideoCardProps = {
  title: string;
  description: string;
  videoUrl: string;
  onEnded: () => void;
};

function isYoutube(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}

function toEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname.includes("youtu.be")
      ? parsed.pathname.replace("/", "")
      : parsed.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
}

export function NeoVideoCard({ title, description, videoUrl, onEnded }: NeoVideoCardProps) {
  const embedUrl = useMemo(() => toEmbedUrl(videoUrl), [videoUrl]);

  return (
    <NeoCard className="overflow-hidden">
      <div className="border-b-4 border-ink bg-violet/15 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="text-sm leading-6 text-black/75">{description}</p>
          </div>
          <NeoBadge variant="info">觀看完畢才會計分</NeoBadge>
        </div>
      </div>

      <div className="p-5">
        <div className="overflow-hidden rounded-neo border-4 border-ink bg-black shadow-neo">
          {isYoutube(videoUrl) ? (
            <iframe
              className="aspect-video w-full"
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              className="aspect-video w-full bg-black object-cover"
              src={videoUrl}
              controls
              playsInline
              onEnded={onEnded}
            >
              您的瀏覽器不支援影片播放。
            </video>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium text-black/70">
            <AlertCircle className="h-4 w-4" />
            不支援手動完成，必須等影片播完
          </p>
        </div>
      </div>
    </NeoCard>
  );
}
