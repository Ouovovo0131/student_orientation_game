import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirebaseAuth } from "../firebase/client";

const SCHOOL_EMAIL_DOMAIN = "@hlhs.hlc.edu.tw";
const TEST_PLAYER_EMAIL = "cheiling0131@gmail.com";

function validateSchoolEmail(email: string | null | undefined): string {
  const normalizedEmail = (email ?? "").trim().toLowerCase();
  if (!normalizedEmail.endsWith(SCHOOL_EMAIL_DOMAIN) && normalizedEmail !== TEST_PLAYER_EMAIL) {
    throw new Error(
      `請使用學校帳號登入（${SCHOOL_EMAIL_DOMAIN}），或使用指定測試帳號 ${TEST_PLAYER_EMAIL}。`,
    );
  }
  return normalizedEmail;
}

export async function schoolLogin(): Promise<string> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    hd: SCHOOL_EMAIL_DOMAIN.slice(1),
    prompt: "select_account",
  });

  try {
    const result = await signInWithPopup(auth, provider);
    validateSchoolEmail(result.user.email);
    return result.user.uid;
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code === "auth/invalid-api-key") {
        throw new Error(
          "Firebase API Key 無效。請檢查 Vercel 環境變數 VITE_FIREBASE_API_KEY 是否填入正確值，並重新部署。",
        );
      }
      if (error.code === "auth/configuration-not-found") {
        throw new Error("Firebase Auth 設定不存在，請確認 Firebase 專案已啟用 Authentication。");
      }
      if (error.code === "auth/account-exists-with-different-credential") {
        throw new Error("這個學校帳號已用其他登入方式註冊，請確認 Firebase 登入設定。");
      }
      if (error.code === "auth/unauthorized-domain") {
        throw new Error("目前網域尚未加入 Firebase Auth 授權網域，請檢查 Firebase Console 設定。");
      }
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("登入視窗已關閉，請重新點擊登入按鈕。");
      }
    }

    try {
      await signOut(auth);
    } catch {
      // Ignore sign-out failures during cleanup.
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("學校帳號登入失敗，請稍後再試。");
  }
}

export async function schoolLogout(): Promise<void> {
  try {
    await signOut(getFirebaseAuth());
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`登出失敗：${error.message}`);
    }
    throw new Error("登出失敗，請稍後再試。");
  }
}