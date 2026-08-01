import type { ApiEnvelope, PlayerState, StageId } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787/api";

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.ok || payload.data === undefined) {
    throw new Error(payload.message || "伺服器回應錯誤，請稍後再試。");
  }

  return payload.data;
}

export async function getPlayerState(uid: string): Promise<PlayerState> {
  return request<PlayerState>(`/players/${uid}`, { method: "GET" });
}

export async function completeStage(uid: string, stageId: StageId): Promise<PlayerState> {
  return request<PlayerState>(`/players/${uid}/complete`, {
    method: "POST",
    body: JSON.stringify({ stageId }),
  });
}

export async function redeem(uid: string): Promise<PlayerState> {
  return request<PlayerState>(`/players/${uid}/redeem`, {
    method: "POST",
  });
}