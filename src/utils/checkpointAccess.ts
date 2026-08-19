import type { StageId } from "../types";
import { isCheckpointLocallyUnlocked } from "./checkpointUnlock";

export type CheckpointAccessStatus = "locked" | "unlocked" | "completed";

const FIRST_STAGE_ID = "stage-01" as StageId;

interface CheckpointAccessInput {
  completed: boolean;
  unlocked: boolean;
}

export function getCheckpointStatus({ completed, unlocked }: CheckpointAccessInput): CheckpointAccessStatus {
  if (completed) {
    return "completed";
  }

  if (unlocked) {
    return "unlocked";
  }

  return "locked";
}

export function isStageUnlocked(
  stageId: StageId,
  unlockedStages: Record<StageId, boolean> | undefined,
  completedStages: Record<StageId, boolean> | undefined,
): boolean {
  if (stageId === FIRST_STAGE_ID) {
    return true;
  }

  if (Boolean(completedStages?.[stageId])) {
    return true;
  }

  return Boolean(unlockedStages?.[stageId]) || isCheckpointLocallyUnlocked(stageId);
}

export function getStageAccessStatus(
  stageId: StageId,
  unlockedStages: Record<StageId, boolean> | undefined,
  completedStages: Record<StageId, boolean> | undefined,
): CheckpointAccessStatus {
  const completed = Boolean(completedStages?.[stageId]);
  const unlocked = isStageUnlocked(stageId, unlockedStages, completedStages);
  return getCheckpointStatus({ completed, unlocked });
}

export function buildStageRange(start: number, end: number, total: number): StageId[] {
  const safeStart = Math.min(Math.max(start, 1), total);
  const safeEnd = Math.min(Math.max(end, 1), total);
  const [from, to] = [safeStart, safeEnd].sort((a, b) => a - b);

  return Array.from({ length: to - from + 1 }, (_, index) => {
    const stageNumber = from + index;
    return `stage-${String(stageNumber).padStart(2, "0")}` as StageId;
  });
}
