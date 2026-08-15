import { ensureCurrentPlayerUid } from "../../server/src/services/adminService";

function getBody(req: { body?: unknown }) {
  if (!req.body) {
    return {} as Record<string, unknown>;
  }
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {} as Record<string, unknown>;
    }
  }
  if (typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }
  return {} as Record<string, unknown>;
}

export default async function handler(req: { method?: string; body?: unknown }, res: { status: (code: number) => { json: (data: unknown) => void } }) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, message: "Method Not Allowed", data: null });
    return;
  }

  const body = getBody(req);
  const idToken = typeof body.idToken === "string" ? body.idToken : "";

  if (!idToken) {
    res.status(400).json({ ok: false, message: "缺少 idToken", data: null });
    return;
  }

  try {
    const data = await ensureCurrentPlayerUid(idToken);
    res.status(200).json({ ok: true, message: "玩家數字 UID 已確認", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "確認玩家 UID 失敗";
    res.status(400).json({ ok: false, message, data: null });
  }
}
