import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirebaseAuth } from "../firebase/client";

const SCHOOL_EMAIL_DOMAIN = "@hlhs.hlc.edu.tw";

function validateSchoolEmail(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail.endsWith(SCHOOL_EMAIL_DOMAIN)) {
    throw new Error(`請使用學校帳號登入，電子郵件必須以 ${SCHOOL_EMAIL_DOMAIN} 結尾。`);
  }
  return normalizedEmail;
}

export async function schoolLogin(email: string, password: string): Promise<string> {
  const normalizedEmail = validateSchoolEmail(email);

  try {
    const result = await signInWithEmailAndPassword(getFirebaseAuth(), normalizedEmail, password);
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
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        throw new Error("學校帳號或密碼錯誤，請重新確認後再登入。");
      }
      if (error.code === "auth/user-not-found") {
        throw new Error("找不到這個學校帳號，請確認是否已完成 Firebase Authentication 建立。");
      }
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("學校帳號登入失敗，請稍後再試。");
  }
}