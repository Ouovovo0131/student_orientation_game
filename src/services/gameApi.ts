import { FirebaseError } from "firebase/app";
import {
  doc,
  getDoc,
  runTransaction,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { CHECKPOINTS } from "../assets/checkpoints";
import { getFirebaseAuth, getFirebaseDb } from "../firebase/client";
import type { PlayerState, StageId } from "../types";

const PLAYERS_COLLECTION = "players";

function initialPlayerState(): PlayerState {
  return {
    score: 0,
    isRedeemed: false,
    redeemTime: null,
    completedStages: {},
  };
}

function normalizePlayerState(input: DocumentData | undefined): PlayerState {
  const data = input ?? {};
  return {
    score: Number(data.score ?? 0),
    isRedeemed: Boolean(data.isRedeemed),
    redeemTime: typeof data.redeemTime === "string" ? data.redeemTime : null,
    completedStages:
      typeof data.completedStages === "object" && data.completedStages
        ? (data.completedStages as Record<StageId, boolean>)
        : {},
  };
}

function mapFirebaseError(error: unknown): Error {
  if (error instanceof FirebaseError) {
    if (error.code === "permission-denied") {
      return new Error("你沒有權限執行此操作，請確認已完成登入且 Firebase 安全規則正確。");
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

function assertCurrentUser(uid: string) {
  const currentUid = getFirebaseAuth().currentUser?.uid;
  if (!currentUid || currentUid !== uid) {
    throw new Error("登入狀態已失效，請重新登入後再試。");
  }
}

export async function getPlayerState(uid: string): Promise<PlayerState> {
  assertCurrentUser(uid);
  const ref = getPlayerRef(uid);

  try {
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      const initial = initialPlayerState();
      await setDoc(ref, initial);
      return initial;
    }
    return normalizePlayerState(snapshot.data());
  } catch (error) {
    throw mapFirebaseError(error);
  }
}

export async function completeStage(uid: string, stageId: StageId): Promise<PlayerState> {
  assertCurrentUser(uid);
  const ref = getPlayerRef(uid);

  try {
    await runTransaction(getFirebaseDb(), async (transaction) => {
      const snapshot = await transaction.get(ref);
      const current = normalizePlayerState(snapshot.data());

      if (current.completedStages[stageId]) {
        return;
      }

      transaction.set(
        ref,
        {
          score: current.score + 1,
          completedStages: {
            ...current.completedStages,
            [stageId]: true,
          },
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
  assertCurrentUser(uid);
  const ref = getPlayerRef(uid);

  try {
    await runTransaction(getFirebaseDb(), async (transaction) => {
      const snapshot = await transaction.get(ref);
      const current = normalizePlayerState(snapshot.data());

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