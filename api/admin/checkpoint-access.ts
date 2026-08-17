import { setCheckpointAccessByAdmin } from "../_lib/adminService";

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
  const target = typeof body.target === "string" ? body.target : "";
  const stageIds = Array.isArray(body.stageIds) ? body.stageIds.filter((x) => typeof x === "string") : [];
  const options = typeof body.options === "object" && body.options ? (body.options as { unlocked?: boolean; completed?: boolean }) : {};

  if (!idToken || !target || stageIds.length === 0) {
    res.status(400).json({ ok: false, message: "缺少必要參數", data: null });
    return;
  }

  try {
    const data = await setCheckpointAccessByAdmin(idToken, target, stageIds, options);
    res.status(200).json({ ok: true, message: "關卡權限更新成功", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "關卡權限更新失敗";
    res.status(400).json({ ok: false, message, data: null });
  }
}
