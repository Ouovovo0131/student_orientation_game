import { CHECKPOINTS } from "../assets/checkpoints";

export function useCheckpoint(stageId?: string) {
  return CHECKPOINTS.find((item) => item.id === stageId) ?? null;
}