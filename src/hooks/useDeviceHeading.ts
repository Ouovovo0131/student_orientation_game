import { useCallback, useEffect, useRef, useState } from "react";

export type HeadingStatus = "idle" | "unsupported" | "denied" | "active";

interface CompassEvent extends DeviceOrientationEvent {
  /** iOS 專有：已經是相對正北的方位角，不需要自己換算 */
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
}

interface OrientationPermissionApi {
  requestPermission?: () => Promise<"granted" | "denied" | "prompt">;
}

/**
 * 讀取手機羅盤，回傳「使用者正面朝向哪個方位」。
 *
 * 回傳的方位角是正北為 0、順時針到 360，跟地圖無關 —— 要畫到圖上還要再經過
 * geo.ts 的 screenAngleForBearing，因為這張校園圖不是正北朝上。
 *
 * 注意 iOS 必須在使用者手勢裡呼叫 requestPermission，所以 start() 要綁在按鈕上，
 * 不能在畫面載入時自動執行。
 */
export function useDeviceHeading() {
  const [status, setStatus] = useState<HeadingStatus>("idle");
  const [heading, setHeading] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const listeningRef = useRef(false);

  const handleOrientation = useCallback((event: Event) => {
    const orientation = event as CompassEvent;

    // iOS 直接給正北方位角；Android 走 absolute 事件的 alpha，方向相反要倒過來。
    let next: number | null = null;
    if (typeof orientation.webkitCompassHeading === "number") {
      next = orientation.webkitCompassHeading;
    } else if (orientation.absolute && typeof orientation.alpha === "number") {
      next = 360 - orientation.alpha;
    }

    if (next === null || Number.isNaN(next)) {
      return;
    }

    // 螢幕轉向時感測器的基準會跟著轉，補回來才不會橫著拿就整個歪掉。
    const screenAngle = typeof screen.orientation?.angle === "number" ? screen.orientation.angle : 0;
    const normalized = (((next + screenAngle) % 360) + 360) % 360;
    setHeading(normalized);
    setStatus("active");
  }, []);

  const attach = useCallback(() => {
    if (listeningRef.current) {
      return;
    }
    listeningRef.current = true;
    window.addEventListener("deviceorientationabsolute", handleOrientation);
    window.addEventListener("deviceorientation", handleOrientation);
  }, [handleOrientation]);

  const stop = useCallback(() => {
    if (!listeningRef.current) {
      return;
    }
    listeningRef.current = false;
    window.removeEventListener("deviceorientationabsolute", handleOrientation);
    window.removeEventListener("deviceorientation", handleOrientation);
    setHeading(null);
    setStatus("idle");
  }, [handleOrientation]);

  /**
   * fromUserGesture 為 false 代表這是進頁面時自動呼叫的。
   *
   * iOS 的方位權限只能在使用者手勢裡要，自動呼叫一定會被拒絕 —— 那會讓使用者
   * 一進來就看到一則他不知道怎麼解決的錯誤訊息。所以自動呼叫時遇到需要授權的
   * 平台就安靜地不做事，等他按下按鈕再要權限。
   */
  const start = useCallback(async (fromUserGesture = true) => {
    if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
      if (fromUserGesture) {
        setStatus("unsupported");
        setMessage("這台裝置沒有提供方位感測器，只會顯示位置不會顯示朝向。");
      }
      return;
    }

    const api = DeviceOrientationEvent as unknown as OrientationPermissionApi;
    if (typeof api.requestPermission === "function") {
      if (!fromUserGesture) {
        return;
      }
      try {
        const result = await api.requestPermission();
        if (result !== "granted") {
          setStatus("denied");
          setMessage("你拒絕了方位感測器權限，所以只會顯示位置不會顯示朝向。");
          return;
        }
      } catch {
        setStatus("denied");
        setMessage("無法取得方位感測器權限，只會顯示位置不會顯示朝向。");
        return;
      }
    }

    setMessage(null);
    attach();
  }, [attach]);

  useEffect(() => stop, [stop]);

  return { status, heading, message, start, stop };
}
