import { signInAnonymously } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirebaseAuth } from "../firebase/client";

export async function anonymousLogin(): Promise<string> {
  try {
    const result = await signInAnonymously(getFirebaseAuth());
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
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("匿名登入失敗，請稍後再試。");
  }
}