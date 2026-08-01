import type { ProgressDocument } from "@/types";

const progressPrefix = "checkpoint-quest:progress:";
const sessionKey = "checkpoint-quest:session";

export function canUseStorage() {
  return typeof window !== "undefined";
}

export function getSessionUserId() {
  if (!canUseStorage()) {
    return "server";
  }

  const existing = window.localStorage.getItem(sessionKey);
  if (existing) {
    return existing;
  }

  const next = `local-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(sessionKey, next);
  return next;
}

export function readLocalProgress(uid: string, defaultProgress: ProgressDocument) {
  if (!canUseStorage()) {
    return defaultProgress;
  }

  const raw = window.localStorage.getItem(`${progressPrefix}${uid}`);
  if (!raw) {
    return defaultProgress;
  }

  try {
    return { ...defaultProgress, ...JSON.parse(raw) } as ProgressDocument;
  } catch {
    return defaultProgress;
  }
}

export function writeLocalProgress(uid: string, progress: ProgressDocument) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(`${progressPrefix}${uid}`, JSON.stringify(progress));
}
