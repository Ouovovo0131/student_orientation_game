import type { StageId } from "../types";

export type CheckpointAccessStatus = "locked" | "unlocked" | "completed";

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

export function buildStageRange(start: number, end: number, total: number): StageId[] {
  const safeStart = Math.min(Math.max(start, 1), total);
  const safeEnd = Math.min(Math.max(end, 1), total);
  const [from, to] = [safeStart, safeEnd].sort((a, b) => a - b);

  return Array.from({ length: to - from + 1 }, (_, index) => {
    const stageNumber = from + index;
    return `stage-${String(stageNumber).padStart(2, "0")}` as StageId;
  });
}
