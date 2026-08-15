import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { CHECKPOINTS } from "../assets/checkpoints";
import { getFirebaseAuth } from "../firebase/client";
import { schoolLogin, schoolLogout } from "../services/authService";
import {
  completeStage,
  getPlayerState,
  getRedeemControl,
  requestRedeemTicket,
  redeem,
  updateRedeemControl,
} from "../services/gameApi";
import type { GameContextValue, PlayerState, RedeemControl, StageId, UserProfile } from "../types";

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [redeemControl, setRedeemControlState] = useState<RedeemControl>(DEFAULT_REDEEM_CONTROL);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (!user) {
        localStorage.removeItem("orientation_uid");
        setUid(null);
        setPlayer(null);
        setUserProfile(null);
        setRedeemControlState(DEFAULT_REDEEM_CONTROL);
        return;
      }

      setUserProfile({
        displayName: user.displayName?.trim() || user.email?.split("@")[0] || "未命名玩家",
        email: user.email?.trim() || "",
        photoURL: user.photoURL,
      });

      if (user.uid !== localStorage.getItem("orientation_uid")) {
        localStorage.setItem("orientation_uid", user.uid);
      }
      setUid(user.uid);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
    const state = await withTask("登入成功，檢查玩家資料（不存在則自動建立）", () => getPlayerState(currentUid));
    const control = await withTask("同步兌換開放狀態中", () => getRedeemControl(currentUid));
    setPlayer(state);
    setRedeemControlState(control);
  }, [withTask]);

  const logout = useCallback(async () => {
    await withTask("正在登出帳號", schoolLogout);
    localStorage.removeItem("orientation_uid");
    setUid(null);
    setPlayer(null);
    setUserProfile(null);
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

  const requestRedeem = useCallback(async () => {
    if (!uid) {
      throw new Error("尚未登入，無法提出兌換請求。請先登入。");
    }
    const state = await withTask("正在通知管理員可兌換名單", () => requestRedeemTicket(uid));
    setPlayer(state);
  }, [uid, withTask]);

  const value = useMemo<GameContextValue>(
    () => ({
      loading,
      taskMessage,
      error,
      player,
      userProfile,
      redeemControl,
      uid,
      totalCheckpoints: CHECKPOINTS.length,
      loginWithSchoolAccount,
      logout,
      refreshPlayer,
      refreshRedeemControl,
      setRedeemControl,
      completeCheckpoint,
      requestRedeemTicket: requestRedeem,
      redeemReward,
    }),
    [
      loading,
      taskMessage,
      error,
      player,
      userProfile,
      redeemControl,
      uid,
      loginWithSchoolAccount,
      logout,
      refreshPlayer,
      refreshRedeemControl,
      setRedeemControl,
      completeCheckpoint,
      requestRedeem,
      redeemReward,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}