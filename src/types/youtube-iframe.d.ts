declare namespace YT {
  interface PlayerEvent {
    data: number;
  }

  interface PlayerOptions {
    videoId: string;
    playerVars?: Record<string, string | number>;
    events?: {
      onStateChange?: (event: PlayerEvent) => void | Promise<void>;
    };
  }

  interface Player {
    destroy(): void;
  }

  interface PlayerConstructor {
    new (element: HTMLElement, options: PlayerOptions): Player;
  }

  interface YTGlobal {
    Player: PlayerConstructor;
    PlayerState: {
      ENDED: number;
    };
  }
}

declare global {
  interface Window {
    YT: YT.YTGlobal;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export {};
