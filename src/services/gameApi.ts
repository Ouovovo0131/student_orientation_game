import type { ApiEnvelope, PlayerState, StageId } from "../types";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  (window.location.hostname === "localhost" ? "http://localhost:8787/api" : "/api");

function parseJsonSafe<T>(text: string): ApiEnvelope<T> | null {
  try {
    return JSON.parse(text) as ApiEnvelope<T>;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const rawText = await response.text();
  const payload = parseJsonSafe<T>(rawText);

  if (!payload) {
    const hint =
      window.location.hostname === "localhost"
        ? "請確認本機後端是否已啟動（預設 http://localhost:8787/api）。"
        : "請確認 Vercel 已設定 VITE_API_BASE_URL 指向可用的後端 API，並重新部署。";
    throw new Error(
      `API 回應格式錯誤（非 JSON）。請求網址：${API_BASE}${path}。${hint}`,
    );
  }

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