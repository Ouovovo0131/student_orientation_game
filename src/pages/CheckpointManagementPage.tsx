import { useState } from "react";
import { Link } from "react-router-dom";
import { CHECKPOINTS } from "../assets/checkpoints";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { NeoInput } from "../components/ui/NeoInput";
import { useGame } from "../hooks/useGame";
import { setCheckpointAccess, syncMissingPlayerUids } from "../services/gameApi";
import { buildStageRange } from "../utils/checkpointAccess";

export function CheckpointManagementPage() {
  const { uid, player } = useGame();
  const [targetUid, setTargetUid] = useState("");
  const [startStage, setStartStage] = useState("1");
  const [endStage, setEndStage] = useState("1");
  const [markCompleted, setMarkCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isAdmin = player?.role === "admin";

  if (!isAdmin) {
    return (
      <PageContainer className="max-w-2xl">
        <NeoCard className="bg-[#FFE48F]">
          <h1 className="text-3xl font-black">此頁僅限管理員</h1>
          <p className="mt-3 text-base">你目前不是管理員，請返回玩家頁面。</p>
          <div className="mt-6">
            <Link to="/checkpoints">
              <NeoButton variant="secondary">返回關卡列表</NeoButton>
            </Link>
          </div>
        </NeoCard>
      </PageContainer>
    );
  }

  const handleSubmit = async () => {
    if (!uid || !targetUid.trim()) {
      setMessage("請填入目標玩家 UID。");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const stageIds = buildStageRange(Number(startStage), Number(endStage), CHECKPOINTS.length);
      await setCheckpointAccess(uid, targetUid.trim(), stageIds, { completed: markCompleted });
      setMessage(`已成功更新 ${stageIds.length} 個關卡的權限。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "更新失敗，請稍後再試。"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSyncPlayerUids = async () => {
    if (!uid) {
      setMessage("尚未登入，無法補齊玩家 UID。");
      return;
    }

    setSyncLoading(true);
    setMessage(null);
    try {
      const result = await syncMissingPlayerUids(uid);
      setMessage(`UID 補齊完成：本次新增 ${result.assignedCount} 筆，玩家總數 ${result.totalPlayers} 筆。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "補齊玩家 UID 失敗，請稍後再試。");
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <PageContainer className="max-w-3xl">
      <NeoCard className="bg-[#E8F2FF]">
        <h1 className="text-3xl font-black">關卡管理頁面</h1>
        <p className="mt-2 text-sm">可為指定玩家一次性解鎖單一關卡或連續多個關卡，也可一併標記為已完成。</p>
        <p className="mt-2 text-sm font-bold">目標玩家可輸入：數字 UID（例如 11500001）、學校 Email，或 Firebase Auth UID。</p>
      </NeoCard>

      <NeoCard className="mt-4">
        <div className="grid gap-4">
          <NeoInput
            label="目標玩家識別"
            value={targetUid}
            onChange={(event) => setTargetUid(event.target.value)}
            placeholder="例如 11500001 或 xxx@hlhs.hlc.edu.tw"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <NeoInput
              label="起始關卡編號"
              type="number"
              min="1"
              max={CHECKPOINTS.length}
              value={startStage}
              onChange={(event) => setStartStage(event.target.value)}
            />
            <NeoInput
              label="結束關卡編號"
              type="number"
              min="1"
              max={CHECKPOINTS.length}
              value={endStage}
              onChange={(event) => setEndStage(event.target.value)}
            />
          </div>
          <label className="flex items-center gap-3 text-sm font-bold">
            <input
              type="checkbox"
              checked={markCompleted}
              onChange={(event) => setMarkCompleted(event.target.checked)}
              className="h-5 w-5 border-4 border-black"
            />
            同時將這些關卡標記為已完成
          </label>
          <NeoButton disabled={loading} onClick={() => void handleSubmit()}>
            {loading ? "更新中..." : "更新關卡權限"}
          </NeoButton>
          <NeoButton variant="secondary" disabled={syncLoading} onClick={() => void handleSyncPlayerUids()}>
            {syncLoading ? "補齊中..." : "補齊所有缺少數字 UID 的玩家"}
          </NeoButton>
          {message && <p className="text-sm font-bold">{message}</p>}
        </div>
      </NeoCard>
    </PageContainer>
  );
}
