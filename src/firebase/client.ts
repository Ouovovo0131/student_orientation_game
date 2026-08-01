import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const REQUIRED_ENV_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

type EnvKey = (typeof REQUIRED_ENV_KEYS)[number];

let cachedAuth: Auth | null = null;

function readEnv(key: EnvKey): string {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
}

function assertFirebaseEnv(): Record<EnvKey, string> {
  const config = {
    VITE_FIREBASE_API_KEY: readEnv("VITE_FIREBASE_API_KEY"),
    VITE_FIREBASE_AUTH_DOMAIN: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    VITE_FIREBASE_PROJECT_ID: readEnv("VITE_FIREBASE_PROJECT_ID"),
    VITE_FIREBASE_STORAGE_BUCKET: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    VITE_FIREBASE_MESSAGING_SENDER_ID: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    VITE_FIREBASE_APP_ID: readEnv("VITE_FIREBASE_APP_ID"),
  } satisfies Record<EnvKey, string>;

  const missing = REQUIRED_ENV_KEYS.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(
      `Firebase 前端環境變數未設定完整：${missing.join(", ")}。請在 Vercel 的 Environment Variables 設定後重新部署。`,
    );
  }

  return config;
}

export function getFirebaseAuth(): Auth {
  if (cachedAuth) {
    return cachedAuth;
  }

  const env = assertFirebaseEnv();
  const app = getApps().length > 0
    ? getApp()
    : initializeApp({
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: env.VITE_FIREBASE_APP_ID,
      });

  cachedAuth = getAuth(app);
  return cachedAuth;
}