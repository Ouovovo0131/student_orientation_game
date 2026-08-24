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
  const stageId = typeof body.stageId === "string" ? body.stageId : "";

  if (!idToken || !stageId) {
    res.status(400).json({ ok: false, message: "缺少必要參數", data: null });
    return;
  }

  try {
    const { listStagePasscodesByAdmin } = await import("../_lib/adminService.js");
    const data = await listStagePasscodesByAdmin(idToken, stageId);
    res.status(200).json({ ok: true, message: "已取得可用通關密碼", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "取得通關密碼失敗";
    res.status(500).json({ ok: false, message, data: null });
  }
}
