import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase/client";

export async function anonymousLogin(): Promise<string> {
  try {
    const result = await signInAnonymously(auth);
    return result.user.uid;
  } catch {
    throw new Error("匿名登入失敗，請稍後再試。");
  }
}