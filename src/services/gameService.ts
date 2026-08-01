import { signInAnonymously } from "firebase/auth";
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, hasConfig } from "@/services/firebase";
import { getSessionUserId, readLocalProgress, writeLocalProgress } from "@/services/storage";
import type { CheckpointId, GameUser, ProgressDocument } from "@/types";

const defaultProgress = (): ProgressDocument => ({
  score: 0,
  isRedeemed: false,
  redeemTime: null,
  completedStages: {},
  updatedAt: null,
});

const progressCollection = "gameProgress";

function nowIso() {
  return new Date().toISOString();
}

function normalizeProgress(raw: unknown): ProgressDocument {
  const fallback = defaultProgress();
  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const source = raw as Partial<ProgressDocument>;
  return {
    score: typeof source.score === "number" ? source.score : fallback.score,
    isRedeemed: Boolean(source.isRedeemed),
    redeemTime: typeof source.redeemTime === "string" ? source.redeemTime : null,
    completedStages:
      source.completedStages && typeof source.completedStages === "object"
        ? (source.completedStages as Record<string, string>)
        : {},
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : null,
  };
}

async function readRemoteProgress(uid: string) {
  if (!db) {
    return null;
  }

  const snapshot = await getDoc(doc(db, progressCollection, uid));
  return snapshot.exists() ? normalizeProgress(snapshot.data()) : defaultProgress();
}

async function writeRemoteProgress(uid: string, next: ProgressDocument) {
  if (!db) {
    return;
  }

  await setDoc(doc(db, progressCollection, uid), {
    ...next,
    updatedAt: serverTimestamp(),
  });
}

export async function createSession(): Promise<{ user: GameUser; source: "firebase" | "local" }> {
  if (hasConfig && auth) {
    const credential = await signInAnonymously(auth);
    return {
      user: {
        uid: credential.user.uid,
        isAnonymous: true,
        displayName: "匿名玩家",
      },
      source: "firebase",
    };
  }

  const uid = getSessionUserId();
  return {
    user: {
      uid,
      isAnonymous: true,
      displayName: "本機玩家",
    },
    source: "local",
  };
}

export async function loadProgress(uid: string) {
  const remote = await readRemoteProgress(uid);
  if (remote) {
    return remote;
  }

  return readLocalProgress(uid, defaultProgress());
}

export async function completeCheckpoint(uid: string, checkpointId: CheckpointId) {
  const current = await loadProgress(uid);
  if (current.completedStages[checkpointId]) {
    return current;
  }

  const next: ProgressDocument = {
    ...current,
    completedStages: {
      ...current.completedStages,
      [checkpointId]: nowIso(),
    },
    score: Object.keys(current.completedStages).length + 1,
    updatedAt: nowIso(),
  };

  if (db) {
    await runTransaction(db, async (transaction) => {
      const ref = doc(db, progressCollection, uid);
      const snapshot = await transaction.get(ref);
      const active = snapshot.exists() ? normalizeProgress(snapshot.data()) : defaultProgress();
      if (active.completedStages[checkpointId]) {
        return;
      }

      transaction.set(ref, {
        ...active,
        completedStages: {
          ...active.completedStages,
          [checkpointId]: nowIso(),
        },
        score: Object.keys(active.completedStages).length + 1,
        updatedAt: serverTimestamp(),
      });
    });
    return next;
  }

  writeLocalProgress(uid, next);
  return next;
}

export async function redeemChallenge(uid: string, totalCheckpoints: number) {
  const current = await loadProgress(uid);
  if (current.score < totalCheckpoints) {
    const error = new Error("not-eligible");
    error.name = "RedeemEligibilityError";
    throw error;
  }

  if (current.isRedeemed) {
    return current;
  }

  const next: ProgressDocument = {
    ...current,
    isRedeemed: true,
    redeemTime: nowIso(),
    updatedAt: nowIso(),
  };

  await writeRemoteProgress(uid, next);
  if (!db) {
    writeLocalProgress(uid, next);
  }

  return next;
}
