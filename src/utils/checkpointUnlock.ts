import { CHECKPOINTS } from "../assets/checkpoints";
import type { StageId } from "../types";

const UNLOCKED_STAGE_STORAGE_KEY = "orientation_unlocked_stages";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getLocallyUnlockedStages(): StageId[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(UNLOCKED_STAGE_STORAGE_KEY);
    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];
    return Array.isArray(parsedValue)
      ? parsedValue.filter((stageId): stageId is StageId => typeof stageId === "string")
      : [];
  } catch {
    return [];
  }
}

export function isCheckpointLocallyUnlocked(stageId: StageId): boolean {
  return getLocallyUnlockedStages().includes(stageId);
}

export function unlockCheckpointLocally(stageId: StageId) {
  if (!canUseStorage()) {
    return;
  }

  const unlockedStages = new Set(getLocallyUnlockedStages());
  unlockedStages.add(stageId);
  window.localStorage.setItem(UNLOCKED_STAGE_STORAGE_KEY, JSON.stringify([...unlockedStages]));
}

export function resolveCheckpointId(levelId?: string): StageId | null {
  if (!levelId) {
    return null;
  }

  const directMatch = CHECKPOINTS.find((checkpoint) => checkpoint.id === levelId);
  if (directMatch) {
    return directMatch.id;
  }

  if (!/^\d+$/.test(levelId)) {
    return null;
  }

  const stageId = `stage-${levelId.padStart(2, "0")}`;
  return CHECKPOINTS.some((checkpoint) => checkpoint.id === stageId) ? stageId : null;
}

export function getCheckpointNumber(stageId: StageId): string | null {
  const index = CHECKPOINTS.findIndex((checkpoint) => checkpoint.id === stageId);
  return index >= 0 ? String(index + 1) : null;
}