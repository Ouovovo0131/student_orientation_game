import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getDb } from "../firebaseAdmin";

const PLAYERS = "players";

export interface PlayerDocument {
  score: number;
  isRedeemed: boolean;
  redeemTime: string | null;
  completedStages: Record<string, boolean>;
}

export async function getOrCreatePlayer(uid: string): Promise<PlayerDocument> {
  const db = getDb();
  const ref = db.collection(PLAYERS).doc(uid);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    const initial: PlayerDocument = {
      score: 0,
      isRedeemed: false,
      redeemTime: null,
      completedStages: {},
    };
    await ref.set(initial);
    return initial;
  }

  return normalize(snapshot.data());
}

export async function completeStageInTransaction(uid: string, stageId: string): Promise<PlayerDocument> {
  const db = getDb();
  const ref = db.collection(PLAYERS).doc(uid);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = normalize(snap.data());

    if (current.completedStages[stageId]) {
      return;
    }

    tx.set(
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

  const next = await ref.get();
  return normalize(next.data());
}

export async function redeemInTransaction(uid: string, totalCheckpoints: number): Promise<PlayerDocument> {
  const db = getDb();
  const ref = db.collection(PLAYERS).doc(uid);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = normalize(snap.data());

    if (current.score < totalCheckpoints) {
      throw new Error("尚未達成全部關卡，無法兌換。");
    }

    if (current.isRedeemed) {
      return;
    }

    tx.set(
      ref,
      {
        isRedeemed: true,
        redeemTime: Timestamp.now().toDate().toISOString(),
      },
      { merge: true },
    );
  });

  const next = await ref.get();
  return normalize(next.data());
}

function normalize(input: FirebaseFirestore.DocumentData | undefined): PlayerDocument {
  const data = input ?? {};
  return {
    score: Number(data.score ?? 0),
    isRedeemed: Boolean(data.isRedeemed),
    redeemTime: typeof data.redeemTime === "string" ? data.redeemTime : null,
    completedStages:
      typeof data.completedStages === "object" && data.completedStages
        ? (data.completedStages as Record<string, boolean>)
        : {},
  };
}