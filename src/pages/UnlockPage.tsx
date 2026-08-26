import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { StageId } from "../types";
import {
  getCheckpointNumber,
  resolveCheckpointId,
  unlockCheckpointLocally,
} from "../utils/checkpointUnlock";
import { useGame } from "../hooks/useGame";

/** 等 Firestore 同步的上限，超過就先放人進關卡頁 */
const SYNC_TIMEOUT_MS = 6000;

export function UnlockPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { uid, syncUnlockedStages } = useGame();

  useEffect(() => {
    const stageId = resolveCheckpointId(levelId);
    if (!stageId) {
      navigate("/checkpoints", { replace: true });
      return;
    }

    // 先寫進 localStorage，這一步不需要網路。就算後面同步失敗，關卡在這台裝置上
    // 仍然是解鎖的，所以任何情況下都應該把人帶去關卡頁，不能停在空白畫面。
    unlockCheckpointLocally(stageId);

    function goToCheckpoints(target: StageId) {
      const checkpointNumber = getCheckpointNumber(target);
      const search = new URLSearchParams({
        focus: target,
        mode: "unlock",
      });

      if (checkpointNumber) {
        search.set("justUnlocked", checkpointNumber);
      }

      navigate(`/checkpoints?${search.toString()}`, { replace: true });
    }

    void (async () => {
      if (uid) {
        try {
          // 這一頁 render 的是 null，所以只要同步卡住就是一片白畫面。訊號差的地方
          // （例如和平樓三樓的輔導室）Firestore 可能遲遲不回應，因此除了捕捉錯誤
          // 之外還要設上限，時間到就先讓人進關卡頁，同步失敗不該擋住闖關。
          await Promise.race([
            syncUnlockedStages([stageId]),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("同步逾時")), SYNC_TIMEOUT_MS),
            ),
          ]);
        } catch (error) {
          // 只記錄不中斷：localStorage 已經解鎖，下次連得上網路時會再同步一次。
          console.warn("解鎖進度同步失敗，改用本機記錄繼續：", error);
        }
      }

      goToCheckpoints(stageId);
    })();
  }, [levelId, navigate, syncUnlockedStages, uid]);

  return null;
}