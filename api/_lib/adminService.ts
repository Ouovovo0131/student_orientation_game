import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getDb } from "./firebaseAdmin.js";

const PLAYERS = "players";
const ADMINS = "admins";
const SYSTEM = "system";
const CHECKPOINT_PASSCODES = "checkpointPasscodes";
const UID_COUNTER_DOC = "playerUidCounter";
const START_PLAYER_UID = 11500001;
const TEST_PLAYER_EMAIL = "cheiling0131@gmail.com";
const ADMIN_EMAILS = new Set(["s310165@hlhs.hlc.edu.tw", "s410337@hlhs.hlc.edu.tw"]);

interface DecodedIdentity {
  uid: string;
  email: string;
}

interface PlayerStateShape {
  score: number;
  isRedeemed: boolean;
  redeemTime: string | null;
  redeemRequested: boolean;
  redeemRequestTime: string | null;
  completedStages: Record<string, boolean>;
  unlockedStages: Record<string, boolean>;
  account: string;
  role: "admin" | "player";
  playerUid: number | null;
}

function isSchoolEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith("@hlhs.hlc.edu.tw") || normalized === TEST_PLAYER_EMAIL;
}

async function verifyIdentity(idToken: string): Promise<DecodedIdentity> {
  const decoded = await getAdminAuth().verifyIdToken(idToken, true);
  const email = (decoded.email ?? "").trim().toLowerCase();

  if (!decoded.uid || !email || !isSchoolEmail(email)) {
    throw new Error("無效登入狀態或非學校帳號。請重新登入後再試。");
  }

  return {
    uid: decoded.uid,
    email,
  };
}

async function assertAdmin(identity: DecodedIdentity): Promise<void> {
  if (ADMIN_EMAILS.has(identity.email)) {
    return;
  }

  const adminDoc = await getDb().collection(ADMINS).doc(identity.uid).get();
  if (!adminDoc.exists) {
    throw new Error("只有管理員可以執行此操作。");
  }
}

function normalizePlayerState(
  input: FirebaseFirestore.DocumentData | undefined,
  fallbackEmail: string,
  fallbackRole: "admin" | "player",
): PlayerStateShape {
  const data = input ?? {};
  return {
    score: Number(data.score ?? 0),
    isRedeemed: Boolean(data.isRedeemed),
    redeemTime: typeof data.redeemTime === "string" ? data.redeemTime : null,
    redeemRequested: Boolean(data.redeemRequested),
    redeemRequestTime: typeof data.redeemRequestTime === "string" ? data.redeemRequestTime : null,
    completedStages:
      typeof data.completedStages === "object" && data.completedStages
        ? (data.completedStages as Record<string, boolean>)
        : {},
    unlockedStages:
      typeof data.unlockedStages === "object" && data.unlockedStages
        ? (data.unlockedStages as Record<string, boolean>)
        : {},
    account: typeof data.account === "string" && data.account.trim() ? data.account : fallbackEmail,
    role: data.role === "admin" || fallbackRole === "admin" ? "admin" : "player",
    playerUid: typeof data.playerUid === "number" && Number.isInteger(data.playerUid) ? data.playerUid : null,
  };
}

function countCompletedStages(completedStages: Record<string, boolean>): number {
  return Object.values(completedStages).filter(Boolean).length;
}

function parsePlayerUidTarget(target: string): number | null {
  if (!/^\d+$/.test(target)) {
    return null;
  }

  const parsed = Number(target);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

async function resolveTargetAuthUid(target: string): Promise<string> {
  const trimmed = target.trim();
  if (!trimmed) {
    throw new Error("請填入目標玩家 UID。");
  }

  const db = getDb();
  const numericUid = parsePlayerUidTarget(trimmed);
  if (numericUid !== null) {
    const byPlayerUid = await db
      .collection(PLAYERS)
      .where("playerUid", "==", numericUid)
      .limit(1)
      .get();

    if (!byPlayerUid.empty) {
      return byPlayerUid.docs[0].id;
    }
  }

  if (trimmed.includes("@")) {
    const byAccount = await db
      .collection(PLAYERS)
      .where("account", "==", trimmed)
      .limit(1)
      .get();

    if (!byAccount.empty) {
      return byAccount.docs[0].id;
    }
  }

  const directDoc = await db.collection(PLAYERS).doc(trimmed).get();
  if (directDoc.exists) {
    return trimmed;
  }

  throw new Error("找不到目標玩家。請輸入數字 UID、帳號 Email，或 Firebase Auth UID。");
}

async function assignUidIfMissingByAuthUid(authUid: string): Promise<number> {
  const db = getDb();
  const playerRef = db.collection(PLAYERS).doc(authUid);
  const counterRef = db.collection(SYSTEM).doc(UID_COUNTER_DOC);

  return db.runTransaction(async (tx) => {
    const playerSnap = await tx.get(playerRef);
    const playerData = playerSnap.data();
    const currentUid = playerData?.playerUid;

    if (typeof currentUid === "number" && Number.isInteger(currentUid) && currentUid > 0) {
      return currentUid;
    }

    const counterSnap = await tx.get(counterRef);
    const rawNext = counterSnap.data()?.nextValue;
    const nextValue =
      typeof rawNext === "number" && Number.isInteger(rawNext) && rawNext >= START_PLAYER_UID
        ? rawNext
        : START_PLAYER_UID;

    tx.set(
      counterRef,
      {
        nextValue: nextValue + 1,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    const role = playerData?.role === "admin" ? "admin" : "player";
    const account = typeof playerData?.account === "string" ? playerData.account : "";

    tx.set(
      playerRef,
      {
        score: Number(playerData?.score ?? 0),
        isRedeemed: Boolean(playerData?.isRedeemed),
        redeemTime: typeof playerData?.redeemTime === "string" ? playerData.redeemTime : null,
        redeemRequested: Boolean(playerData?.redeemRequested),
        redeemRequestTime:
          typeof playerData?.redeemRequestTime === "string" ? playerData.redeemRequestTime : null,
        completedStages:
          typeof playerData?.completedStages === "object" && playerData?.completedStages
            ? playerData.completedStages
            : {},
        unlockedStages:
          typeof playerData?.unlockedStages === "object" && playerData?.unlockedStages
            ? playerData.unlockedStages
            : {},
        account,
        role,
        playerUid: nextValue,
      },
      { merge: true },
    );

    return nextValue;
  });
}

export async function ensureCurrentPlayerUid(idToken: string): Promise<{ playerUid: number }> {
  const identity = await verifyIdentity(idToken);
  const playerUid = await assignUidIfMissingByAuthUid(identity.uid);
  return { playerUid };
}

export async function syncMissingPlayerUids(idToken: string): Promise<{ assignedCount: number; totalPlayers: number }> {
  const identity = await verifyIdentity(idToken);
  await assertAdmin(identity);

  const snapshot = await getDb().collection(PLAYERS).get();
  const docs = [...snapshot.docs];
  docs.sort((a, b) => {
    const aMillis = a.createTime?.toMillis?.() ?? 0;
    const bMillis = b.createTime?.toMillis?.() ?? 0;
    if (aMillis === bMillis) {
      return a.id.localeCompare(b.id);
    }
    return aMillis - bMillis;
  });

  let assignedCount = 0;
  for (const docSnap of docs) {
    const currentUid = docSnap.data()?.playerUid;
    if (typeof currentUid === "number" && Number.isInteger(currentUid) && currentUid > 0) {
      continue;
    }
    await assignUidIfMissingByAuthUid(docSnap.id);
    assignedCount += 1;
  }

  return {
    assignedCount,
    totalPlayers: docs.length,
  };
}

export async function setCheckpointAccessByAdmin(
  idToken: string,
  target: string,
  stageIds: string[],
  options: { unlocked?: boolean; completed?: boolean } = {},
): Promise<PlayerStateShape> {
  const identity = await verifyIdentity(idToken);
  await assertAdmin(identity);

  const uniqueStageIds = Array.from(new Set(stageIds.filter(Boolean)));
  if (uniqueStageIds.length === 0) {
    throw new Error("請至少選擇一個關卡。");
  }

  const db = getDb();
  const targetAuthUid = await resolveTargetAuthUid(target);
  const targetRef = db.collection(PLAYERS).doc(targetAuthUid);

  await db.runTransaction(async (tx) => {
    const targetSnap = await tx.get(targetRef);
    const current = normalizePlayerState(targetSnap.data(), "", "player");
    const nextUnlocked = { ...current.unlockedStages };
    const nextCompleted = { ...current.completedStages };

    for (const stageId of uniqueStageIds) {
      if (options.unlocked !== false) {
        nextUnlocked[stageId] = true;
      }
      if (options.completed) {
        nextCompleted[stageId] = true;
      }
    }

    tx.set(
      targetRef,
      {
        unlockedStages: nextUnlocked,
        completedStages: nextCompleted,
        score: countCompletedStages(nextCompleted),
      },
      { merge: true },
    );
  });

  await assignUidIfMissingByAuthUid(targetAuthUid);
  const nextSnap = await targetRef.get();
  return normalizePlayerState(nextSnap.data(), "", "player");
}

function isPasscodeFormatValid(code: string): boolean {
  return /^\d{6}$/.test(code);
}

async function fetchStagePasscodes(stageId: string): Promise<string[]> {
  const doc = await getDb().collection(CHECKPOINT_PASSCODES).doc(stageId).get();
  const codes = doc.data()?.codes;
  return Array.isArray(codes) ? codes.filter((code): code is string => typeof code === "string") : [];
}

export async function verifyStagePasscodeByPlayer(
  idToken: string,
  stageId: string,
  code: string,
): Promise<PlayerStateShape> {
  const identity = await verifyIdentity(idToken);
  const trimmedCode = code.trim();

  if (!isPasscodeFormatValid(trimmedCode)) {
    throw new Error("密碼格式錯誤，請輸入 6 位數字密碼。");
  }

  const validCodes = await fetchStagePasscodes(stageId);
  if (!validCodes.includes(trimmedCode)) {
    throw new Error("密碼錯誤，請再向工作人員確認通關密碼。");
  }

  const db = getDb();
  const playerRef = db.collection(PLAYERS).doc(identity.uid);

  await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(playerRef);
    const current = normalizePlayerState(snapshot.data(), identity.email, "player");

    if (current.completedStages[stageId]) {
      return;
    }

    if (!current.unlockedStages[stageId]) {
      throw new Error("此關卡尚未解鎖，請先完成前一關。");
    }

    const nextCompletedStages = {
      ...current.completedStages,
      [stageId]: true,
    };

    tx.set(
      playerRef,
      {
        score: countCompletedStages(nextCompletedStages),
        completedStages: nextCompletedStages,
      },
      { merge: true },
    );
  });

  const nextSnap = await playerRef.get();
  return normalizePlayerState(nextSnap.data(), identity.email, "player");
}

export async function listStagePasscodesByAdmin(idToken: string, stageId: string): Promise<{ codes: string[] }> {
  const identity = await verifyIdentity(idToken);
  await assertAdmin(identity);

  const codes = await fetchStagePasscodes(stageId);
  return { codes };
}
