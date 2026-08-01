import { Router } from "express";
import {
  completeStageInTransaction,
  getOrCreatePlayer,
  redeemInTransaction,
} from "../services/gameService";

const router = Router();

const TOTAL_CHECKPOINTS = Number(process.env.TOTAL_CHECKPOINTS ?? 3);

router.get("/players/:uid", async (req, res) => {
  try {
    const data = await getOrCreatePlayer(req.params.uid);
    res.json({ ok: true, message: "成功取得玩家資料", data });
  } catch {
    res.status(500).json({ ok: false, message: "讀取玩家資料失敗", data: null });
  }
});

router.post("/players/:uid/complete", async (req, res) => {
  const { stageId } = req.body as { stageId?: string };

  if (!stageId) {
    res.status(400).json({ ok: false, message: "缺少 stageId 參數", data: null });
    return;
  }

  try {
    const data = await completeStageInTransaction(req.params.uid, stageId);
    res.json({ ok: true, message: "已成功提交影片完成紀錄", data });
  } catch {
    res.status(500).json({ ok: false, message: "提交關卡失敗", data: null });
  }
});

router.post("/players/:uid/redeem", async (req, res) => {
  try {
    const data = await redeemInTransaction(req.params.uid, TOTAL_CHECKPOINTS);
    res.json({ ok: true, message: "兌換狀態更新成功", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "兌換失敗";
    res.status(400).json({ ok: false, message, data: null });
  }
});

export default router;