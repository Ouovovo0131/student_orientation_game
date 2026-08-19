import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCheckpointNumber,
  resolveCheckpointId,
  unlockCheckpointLocally,
} from "../utils/checkpointUnlock";
import { useGame } from "../hooks/useGame";

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

    unlockCheckpointLocally(stageId);
    void (async () => {
      if (uid) {
        await syncUnlockedStages([stageId]);
      }

      const checkpointNumber = getCheckpointNumber(stageId);
      const search = new URLSearchParams({
        focus: stageId,
        mode: "unlock",
      });

      if (checkpointNumber) {
        search.set("justUnlocked", checkpointNumber);
      }

      navigate(`/checkpoints?${search.toString()}`, { replace: true });
    })();
  }, [levelId, navigate, syncUnlockedStages, uid]);

  return null;
}