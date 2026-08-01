import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { CHECKPOINTS } from "../assets/checkpoints";
import { schoolLogin, schoolLogout } from "../services/authService";
import {
  completeStage,
  getPlayerState,
  getRedeemControl,
  redeem,
  updateRedeemControl,
} from "../services/gameApi";
import type { GameContextValue, PlayerState, RedeemControl, StageId } from "../types";

export const GameContext = createContext<GameContextValue | null>(null);

const DEFAULT_TASK = "等待玩家開始闖關";
const DEFAULT_REDEEM_CONTROL: RedeemControl = {
  isOpen: false,
  qrCodeUrl: null,
};

export function GameProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false);
  const [taskMessage, setTaskMessage] = useState(DEFAULT_TASK);
  const [error, setError] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(
    localStorage.getItem("orientation_uid"),
  );
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [redeemControl, setRedeemControlState] = useState<RedeemControl>(DEFAULT_REDEEM_CONTROL);

  const withTask = useCallback(async <T,>(message: string, action: () => Promise<T>) => {
    setLoading(true);
    setTaskMessage(message);
    setError(null);
    try {
      return await action();
    } catch (err) {
      const text = err instanceof Error ? err.message : "系統發生未知錯誤";
      setError(text);
      throw err;
    } finally {
      setLoading(false);
      setTaskMessage(DEFAULT_TASK);
    }
  }, []);

  const refreshPlayer = useCallback(async () => {
    if (!uid) {
      return;
    }
    const data = await withTask("同步最新闖關進度中", () => getPlayerState(uid));
    setPlayer(data);
  }, [uid, withTask]);

  const refreshRedeemControl = useCallback(async () => {
    if (!uid) {
      return;
    }
    const control = await withTask("同步兌換開放狀態中", () => getRedeemControl(uid));
    setRedeemControlState(control);
  }, [uid, withTask]);

  const loginWithSchoolAccount = useCallback(async () => {
    const currentUid = await withTask("使用學校帳號登入中", schoolLogin);
    localStorage.setItem("orientation_uid", currentUid);
    setUid(currentUid);
    const state = await withTask("建立玩家初始資料中", () => getPlayerState(currentUid));
    const control = await withTask("同步兌換開放狀態中", () => getRedeemControl(currentUid));
    setPlayer(state);
    setRedeemControlState(control);
  }, [withTask]);

  const logout = useCallback(async () => {
    await withTask("正在登出帳號", schoolLogout);
    localStorage.removeItem("orientation_uid");
    setUid(null);
    setPlayer(null);
    setRedeemControlState(DEFAULT_REDEEM_CONTROL);
  }, [withTask]);

  const setRedeemControl = useCallback(async (payload: RedeemControl) => {
    if (!uid) {
      throw new Error("尚未登入，無法調整兌換開關。請先登入。");
    }
    const control = await withTask("管理員正在更新兌換開關", () => updateRedeemControl(uid, payload));
    setRedeemControlState(control);
  }, [uid, withTask]);

  const completeCheckpoint = useCallback(
    async (stageId: StageId) => {
      if (!uid) {
        throw new Error("尚未登入，無法提交關卡。請先登入。");
      }
      const state = await withTask("正在提交影片完成紀錄", () => completeStage(uid, stageId));
      setPlayer(state);
    },
    [uid, withTask],
  );

  const redeemReward = useCallback(async () => {
    if (!uid) {
      throw new Error("尚未登入，無法兌換獎勵。請先登入。");
    }
    const state = await withTask("正在確認兌換資格並鎖定兌換狀態", () => redeem(uid));
    setPlayer(state);
  }, [uid, withTask]);

  const value = useMemo<GameContextValue>(
    () => ({
      loading,
      taskMessage,
      error,
      player,
      redeemControl,
      uid,
      totalCheckpoints: CHECKPOINTS.length,
      loginWithSchoolAccount,
      logout,
      refreshPlayer,
      refreshRedeemControl,
      setRedeemControl,
      completeCheckpoint,
      redeemReward,
    }),
    [
      loading,
      taskMessage,
      error,
      player,
      redeemControl,
      uid,
      loginWithSchoolAccount,
      logout,
      refreshPlayer,
      refreshRedeemControl,
      setRedeemControl,
      completeCheckpoint,
      redeemReward,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}