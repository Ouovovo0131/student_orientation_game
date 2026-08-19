import { useEffect, useMemo, useRef, useState } from "react";
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
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);
  const youtubePlayerRef = useRef<YT.Player | null>(null);

  const youtubeVideoId = useMemo(() => getYouTubeVideoId(videoUrl), [videoUrl]);

  useEffect(() => {
    if (!youtubeVideoId || !iframeContainerRef.current) {
      return;
    }

    let cancelled = false;

    const mountPlayer = async () => {
      const YT = await loadYouTubeApi();
      if (cancelled || !iframeContainerRef.current) {
        return;
      }

      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = new YT.Player(iframeContainerRef.current, {
        videoId: youtubeVideoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: async (event: YT.PlayerEvent) => {
            if (event.data !== YT.PlayerState.ENDED) {
              return;
            }
            if (completed || sending) {
              return;
            }
            setSending(true);
            try {
              await onEnded();
            } finally {
              setSending(false);
            }
          },
        },
      });
    };

    void mountPlayer();

    return () => {
      cancelled = true;
      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = null;
    };
  }, [youtubeVideoId, onEnded, completed, sending]);

  return (
    <NeoCard>
      <h2 className="text-2xl font-black">{title}</h2>
      <p className="mt-2 text-sm">{description}</p>
      <div className="mt-4 overflow-hidden border-4 border-black">
        {youtubeVideoId ? (
          <div className="aspect-video w-full bg-black" ref={iframeContainerRef} aria-label={`${title} YouTube 影片`} />
        ) : (
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
        )}
      </div>
      <p className="mt-3 text-sm font-bold">
        {completed
          ? "此關卡已完成，分數已記錄。"
          : "請完整播放到結束，系統才會自動加分。"}
      </p>
    </NeoCard>
  );
}

function getYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "").trim();
      return id || null;
    }

    if (host.includes("youtube.com")) {
      const id = parsed.searchParams.get("v")?.trim();
      if (id) {
        return id;
      }

      const segments = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = segments.indexOf("embed");
      if (embedIndex >= 0 && segments[embedIndex + 1]) {
        return segments[embedIndex + 1];
      }

      const shortsIndex = segments.indexOf("shorts");
      if (shortsIndex >= 0 && segments[shortsIndex + 1]) {
        return segments[shortsIndex + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

let youtubeApiLoader: Promise<YT.YTGlobal> | null = null;

function loadYouTubeApi(): Promise<YT.YTGlobal> {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (!youtubeApiLoader) {
    youtubeApiLoader = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        resolve(window.YT);
      };

      const existingScript = document.getElementById("youtube-iframe-api");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
    });
  }

  return youtubeApiLoader;
}