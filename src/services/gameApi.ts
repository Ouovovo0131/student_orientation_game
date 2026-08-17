import { FirebaseError } from "firebase/app";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { CHECKPOINTS } from "../assets/checkpoints";
import { getFirebaseAuth, getFirebaseDb } from "../firebase/client";
import type { PlayerRole, PlayerState, RedeemControl, RedeemStats, StageId } from "../types";
import { isStageUnlocked } from "../utils/checkpointAccess";

const PLAYERS_COLLECTION = "players";
const ADMINS_COLLECTION = "admins";
const SYSTEM_COLLECTION = "system";
const REDEEM_CONTROL_DOCUMENT = "redeemControl";
const ADMIN_EMAILS = ["s310165@hlhs.hlc.edu.tw"];

const DEFAULT_REDEEM_CONTROL: RedeemControl = {
  isOpen: false,
};

interface CurrentIdentity {
  uid: string;
  email: string;
  role: PlayerRole;
}

interface ServerEnvelope<T> {
  ok: boolean;
  message: string;
  data: T | null;
}

interface EnsurePlayerUidPayload {
  playerUid: number;
}

function getServerApiBaseUrl(): string {
  const value = import.meta.env.VITE_SERVER_API_BASE_URL;
  if (typeof value === "string" && value.trim()) {
    return value.trim().replace(/\/$/, "");
  }
  return "/api";
}

async function callServerApi<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${getServerApiBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let payload: ServerEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ServerEnvelope<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.ok || payload.data == null) {
    throw new Error(payload?.message ?? "伺服器操作失敗，請稍後再試。");
  }

  return payload.data;
}

async function getCurrentIdToken(expectedUid: string): Promise<string> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser ?? await waitForAuthUser();
  if (!user || user.uid !== expectedUid) {
    throw new Error("登入狀態已失效，請重新登入後再試。");
  }
  return user.getIdToken(true);
}

async function ensureNumericPlayerUid(uid: string): Promise<number> {
  try {
    const idToken = await getCurrentIdToken(uid);
    const data = await callServerApi<EnsurePlayerUidPayload>("/player/ensure-uid", { idToken });
    if (!Number.isInteger(data.playerUid) || data.playerUid <= 0) {
      throw new Error("系統無法配發玩家 UID，請稍後再試。");
    }
    return data.playerUid;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("伺服器操作失敗")) {
      throw new Error("玩家資料初始化失敗：UID 配發服務目前無法使用。請確認 Vercel 已重新部署，且 FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY 已正確設定。");
    }
    throw error instanceof Error ? error : new Error("玩家資料初始化失敗，請稍後再試。");
  }
}

function initialPlayerState(identity: CurrentIdentity): PlayerState {
  return {
    playerUid: null,
    score: 0,
    isRedeemed: false,
    redeemTime: null,
    redeemRequested: false,
    redeemRequestTime: null,
    completedStages: {},
    unlockedStages: {},
    account: identity.email,
    role: identity.role,
  };
}

function normalizePlayerState(input: DocumentData | undefined): PlayerState {
  const data = input ?? {};
  return {
    playerUid: typeof data.playerUid === "number" && Number.isInteger(data.playerUid)
      ? data.playerUid
      : null,
    score: Number(data.score ?? 0),
    isRedeemed: Boolean(data.isRedeemed),
    redeemTime: typeof data.redeemTime === "string" ? data.redeemTime : null,
    redeemRequested: Boolean(data.redeemRequested),
    redeemRequestTime: typeof data.redeemRequestTime === "string" ? data.redeemRequestTime : null,
    completedStages:
      typeof data.completedStages === "object" && data.completedStages
        ? (data.completedStages as Record<StageId, boolean>)
        : {},
    unlockedStages:
      typeof data.unlockedStages === "object" && data.unlockedStages
        ? (data.unlockedStages as Record<StageId, boolean>)
        : {},
    account: typeof data.account === "string" ? data.account : "",
    role: data.role === "admin" ? "admin" : "player",
  };
}

function normalizeRedeemControl(input: DocumentData | undefined): RedeemControl {
  const data = input ?? {};
  return {
    isOpen: Boolean(data.isOpen),
  };
}

function mapFirebaseError(error: unknown): Error {
  if (error instanceof FirebaseError) {
    if (error.code === "permission-denied") {
      return new Error(
        "你沒有權限執行此操作。請先確認：1) 已在 Firebase Console 發布最新 firestore.rules；2) 目前登入的是學校帳號；3) VITE_FIREBASE_PROJECT_ID 指向你正在查看的同一個 Firebase 專案。",
      );
    }
    if (error.code === "unavailable") {
      return new Error("目前無法連線到 Firebase，請稍後再試。");
    }
  }
  return error instanceof Error ? error : new Error("系統發生未知錯誤");
}

function getPlayerRef(uid: string) {
  return doc(getFirebaseDb(), PLAYERS_COLLECTION, uid);
}

function getAdminRef(uid: string) {
  return doc(getFirebaseDb(), ADMINS_COLLECTION, uid);
}

function getRedeemControlRef() {
  return doc(getFirebaseDb(), SYSTEM_COLLECTION, REDEEM_CONTROL_DOCUMENT);
}

function waitForAuthUser(): Promise<User | null> {
  const auth = getFirebaseAuth();
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

async function getCurrentIdentity(expectedUid: string): Promise<CurrentIdentity> {
  const auth = getFirebaseAuth();
  let user = auth.currentUser;
  let currentUid = user?.uid;

  if (!currentUid || currentUid !== expectedUid) {
    user = await waitForAuthUser();
    currentUid = user?.uid;
  }

  if (!currentUid || currentUid !== expectedUid) {
    throw new Error("登入狀態已失效，請重新登入後再試。");
  }

  if (!user) {
    throw new Error("登入狀態已失效，請重新登入後再試。");
  }

  const email = user.email?.trim();
  if (!email) {
    throw new Error("無法取得登入帳號資訊，請重新登入後再試。");
  }

  const normalizedEmail = email.toLowerCase();
  const adminSnapshot = await getDoc(getAdminRef(currentUid));
  return {
    uid: currentUid,
    email,
    role: adminSnapshot.exists() || ADMIN_EMAILS.includes(normalizedEmail) ? "admin" : "player",
  };
}

export async function getPlayerState(uid: string): Promise<PlayerState> {
  const identity = await getCurrentIdentity(uid);
  const ref = getPlayerRef(uid);

  try {
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      const initial = initialPlayerState(identity);
      initial.playerUid = await ensureNumericPlayerUid(uid);
      await setDoc(ref, {
        playerUid: initial.playerUid,
        score: initial.score,
        isRedeemed: initial.isRedeemed,
        redeemTime: initial.redeemTime,
        redeemRequested: initial.redeemRequested,
        redeemRequestTime: initial.redeemRequestTime,
        completedStages: initial.completedStages,
        unlockedStages: initial.unlockedStages,
        account: initial.account,
        role: initial.role,
      });
      return initial;
    }

    let data = normalizePlayerState(snapshot.data());
    if (!data.playerUid) {
      data = { ...data, playerUid: await ensureNumericPlayerUid(uid) };
    }

    if (
      data.account !== identity.email
      || data.role !== identity.role
      || typeof snapshot.data()?.redeemRequested !== "boolean"
      || (
        snapshot.data()?.redeemRequestTime !== null
        && typeof snapshot.data()?.redeemRequestTime !== "string"
        && typeof snapshot.data()?.redeemRequestTime !== "undefined"
      )
    ) {
      const next = {
        ...data,
        account: identity.email,
        role: identity.role,
      };
      await setDoc(ref, next, { merge: true });
      return next;
    }

    return data;
  } catch (error) {
    throw mapFirebaseError(error);
  }
}

function getNextStageId(stageId: StageId): StageId | null {
  const index = CHECKPOINTS.findIndex((checkpoint) => checkpoint.id === stageId);
  const nextCheckpoint = CHECKPOINTS[index + 1];
  return nextCheckpoint?.id ?? null;
}

export async function completeStage(uid: string, stageId: StageId): Promise<PlayerState> {
  await getCurrentIdentity(uid);
  const ref = getPlayerRef(uid);

  try {
    await runTransaction(getFirebaseDb(), async (transaction) => {
      const snapshot = await transaction.get(ref);
      const current = normalizePlayerState(snapshot.data());

      if (!isStageUnlocked(stageId, current.unlockedStages, current.completedStages)) {
        throw new Error("此關卡尚未解鎖，請先完成前一關。" );
      }

      if (current.completedStages[stageId]) {
        return;
      }

      const nextCompletedStages = {
        ...current.completedStages,
        [stageId]: true,
      };
      const nextUnlockedStages = {
        ...current.unlockedStages,
      };

      const nextStageId = getNextStageId(stageId);
      if (nextStageId) {
        nextUnlockedStages[nextStageId] = true;
      }

      transaction.set(
        ref,
        {
          score: Object.values(nextCompletedStages).filter(Boolean).length,
          completedStages: nextCompletedStages,
          unlockedStages: nextUnlockedStages,
        },
        { merge: true },
      );
    });

    const next = await getDoc(ref);
    return normalizePlayerState(next.data());
  } catch (error) {
    throw mapFirebaseError(error);
  }
}

export async function redeem(uid: string): Promise<PlayerState> {
  await getCurrentIdentity(uid);
  const ref = getPlayerRef(uid);
  const controlRef = getRedeemControlRef();

  try {
    await runTransaction(getFirebaseDb(), async (transaction) => {
      const snapshot = await transaction.get(ref);
      const current = normalizePlayerState(snapshot.data());
      const controlSnapshot = await transaction.get(controlRef);
      const control = normalizeRedeemControl(controlSnapshot.data());

      if (!control.isOpen) {
        throw new Error("兌換尚未開放，請先由管理員開啟兌換。");
      }

      if (current.score < CHECKPOINTS.length) {
        throw new Error("尚未達成全部關卡，無法兌換。");
      }

      if (current.isRedeemed) {
        return;
      }

      transaction.set(
        ref,
        {
          isRedeemed: true,
          redeemTime: new Date().toISOString(),
          redeemRequested: false,
        },
        { merge: true },
      );
    });

    const next = await getDoc(ref);
    return normalizePlayerState(next.data());
  } catch (error) {
    throw mapFirebaseError(error);
  }
}

export async function requestRedeemTicket(uid: string): Promise<PlayerState> {
  await getCurrentIdentity(uid);
  const ref = getPlayerRef(uid);
  const controlRef = getRedeemControlRef();

  try {
    await runTransaction(getFirebaseDb(), async (transaction) => {
      const snapshot = await transaction.get(ref);
      const current = normalizePlayerState(snapshot.data());
      const controlSnapshot = await transaction.get(controlRef);
      const control = normalizeRedeemControl(controlSnapshot.data());

      if (!control.isOpen) {
        throw new Error("兌換尚未開放，請先由管理員開啟兌換。");
      }

      if (current.score < CHECKPOINTS.length) {
        throw new Error("尚未達成全部關卡，目前不可提出兌換請求。");
      }

      if (current.isRedeemed || current.redeemRequested) {
        return;
      }

      transaction.set(
        ref,
        {
          redeemRequested: true,
          redeemRequestTime: new Date().toISOString(),
        },
        { merge: true },
      );
    });

    const next = await getDoc(ref);
    return normalizePlayerState(next.data());
  } catch (error) {
    throw mapFirebaseError(error);
  }
}

export async function getRedeemControl(uid: string): Promise<RedeemControl> {
  await getCurrentIdentity(uid);

  try {
    const snapshot = await getDoc(getRedeemControlRef());
    if (!snapshot.exists()) {
      return DEFAULT_REDEEM_CONTROL;
    }
    return normalizeRedeemControl(snapshot.data());
  } catch (error) {
    throw mapFirebaseError(error);
  }
}

export async function updateRedeemControl(uid: string, payload: RedeemControl): Promise<RedeemControl> {
  const identity = await getCurrentIdentity(uid);
  if (identity.role !== "admin") {
    throw new Error("只有管理員可以調整兌換開關。");
  }

  const next: RedeemControl = {
    isOpen: payload.isOpen,
  };

  try {
    await setDoc(getRedeemControlRef(), next, { merge: true });
    return next;
  } catch (error) {
    throw mapFirebaseError(error);
  }
}

export async function setCheckpointAccess(
  adminUid: string,
  targetUid: string,
  stageIds: StageId[],
  options: { unlocked?: boolean; completed?: boolean } = {},
): Promise<PlayerState> {
  const identity = await getCurrentIdentity(adminUid);
  if (identity.role !== "admin") {
    throw new Error("只有管理員可以管理關卡解鎖。" );
  }

  const normalizedStageIds = Array.from(new Set(stageIds.filter(Boolean)));
  if (normalizedStageIds.length === 0) {
    throw new Error("請至少選擇一個關卡。" );
  }

  try {
    const idToken = await getCurrentIdToken(adminUid);
    return await callServerApi<PlayerState>("/admin/checkpoint-access", {
      idToken,
      target: targetUid.trim(),
      stageIds: normalizedStageIds,
      options,
    });
  } catch (error) {
    throw mapFirebaseError(error);
  }
}

export async function getRedeemStats(uid: string, totalCheckpoints: number): Promise<RedeemStats> {
  const identity = await getCurrentIdentity(uid);
  if (identity.role !== "admin") {
    throw new Error("只有管理員可以查看兌換統計。");
  }

  try {
    const snapshot = await getDocs(collection(getFirebaseDb(), PLAYERS_COLLECTION));
    let totalPlayers = 0;
    let eligiblePlayers = 0;
    let ineligiblePlayers = 0;
    let redeemedPlayers = 0;
    let waitingRedeemPlayers = 0;
    const requestedAccounts: string[] = [];

    snapshot.forEach((docSnapshot) => {
      const state = normalizePlayerState(docSnapshot.data());
      if (state.role !== "player") {
        return;
      }

      totalPlayers += 1;

      if (state.score >= totalCheckpoints) {
        eligiblePlayers += 1;
      } else {
        ineligiblePlayers += 1;
      }

      if (state.isRedeemed) {
        redeemedPlayers += 1;
      } else if (state.score >= totalCheckpoints) {
        waitingRedeemPlayers += 1;
      }

      if (state.redeemRequested && !state.isRedeemed) {
        requestedAccounts.push(state.account || docSnapshot.id);
      }
    });

    requestedAccounts.sort((a, b) => a.localeCompare(b));

    return {
      totalPlayers,
      eligiblePlayers,
      ineligiblePlayers,
      redeemedPlayers,
      waitingRedeemPlayers,
      requestedAccounts,
    };
  } catch (error) {
    throw mapFirebaseError(error);
  }
}