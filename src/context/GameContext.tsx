import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { checkpoints } from "@/data/checkpoints";
import { completeCheckpoint, createSession, loadProgress, redeemChallenge } from "@/services/gameService";
import type { GameContextValue, GameState, ProgressDocument } from "@/types";

const GameContext = createContext<GameContextValue | null>(null);

const initialProgress: ProgressDocument = {
  score: 0,
  isRedeemed: false,
  redeemTime: null,
  completedStages: {},
  updatedAt: null,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    status: "loading",
    source: "local",
    user: null,
    progress: null,
    error: null,
  });

  async function bootstrap() {
    try {
      const session = await createSession();
      const progress = await loadProgress(session.user.uid);
      setState({
        status: "ready",
        source: session.source,
        user: session.user,
        progress,
        error: null,
      });
    } catch (error) {
      setState({
        status: "error",
        source: "local",
        user: null,
        progress: null,
        error: error instanceof Error ? error.message : "初始化失敗",
      });
    }
  }

  useEffect(() => {
    void bootstrap();
  }, []);

  const value = useMemo<GameContextValue>(() => {
    const progress = state.progress ?? initialProgress;
    const completedIds = Object.keys(progress.completedStages);
    const totalCheckpoints = checkpoints.length;
    const completedCount = completedIds.length;
    const nextCheckpoint = checkpoints.find((checkpoint) => !progress.completedStages[checkpoint.id]) ?? null;
    const isComplete = progress.score >= totalCheckpoints && totalCheckpoints > 0;
    const hasFailed = state.status === "ready" && !isComplete && completedCount < totalCheckpoints && progress.score < totalCheckpoints;

    return {
      ...state,
      checkpoints,
      totalCheckpoints,
      completedCount,
      completedIds,
      nextCheckpoint,
      isComplete,
      hasFailed,
      isRedeemed: progress.isRedeemed,
      ready: state.status === "ready",
      refresh: async () => {
        if (!state.user) {
          return;
        }

        const next = await loadProgress(state.user.uid);
        setState((current) => ({ ...current, progress: next }));
      },
      completeCheckpoint: async (checkpointId) => {
        if (!state.user) {
          throw new Error("尚未登入");
        }

        const next = await completeCheckpoint(state.user.uid, checkpointId);
        setState((current) => ({ ...current, progress: next }));
        return next;
      },
      redeemChallenge: async () => {
        if (!state.user) {
          throw new Error("尚未登入");
        }

        const next = await redeemChallenge(state.user.uid, totalCheckpoints);
        setState((current) => ({ ...current, progress: next }));
        return next;
      },
      signIn: bootstrap,
    };
  }, [state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const value = useContext(GameContext);
  if (!value) {
    throw new Error("useGameContext 必須在 GameProvider 內使用");
  }

  return value;
}
