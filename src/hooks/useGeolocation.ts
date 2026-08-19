import { useCallback, useEffect, useRef, useState } from "react";

export interface GeoFix {
  lat: number;
  lng: number;
  /** 定位誤差半徑，單位公尺 */
  accuracy: number;
  timestamp: number;
}

export type GeoStatus =
  | "idle"
  | "unsupported"
  | "insecure"
  | "locating"
  | "tracking"
  | "denied"
  | "error";

interface GeoState {
  status: GeoStatus;
  fix: GeoFix | null;
  message: string | null;
}

const INITIAL_STATE: GeoState = {
  status: "idle",
  fix: null,
  message: null,
};

/**
 * 包裝 navigator.geolocation.watchPosition，並把瀏覽器的英文錯誤換成中文說明。
 *
 * 定位必須由使用者主動觸發（iOS Safari 尤其嚴格），所以這裡不自動開始，
 * 要由畫面上的按鈕呼叫 start()。
 */
export function useGeolocation() {
  const [state, setState] = useState<GeoState>(INITIAL_STATE);
  const watchIdRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState(INITIAL_STATE);
  }, []);

  const start = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({
        status: "unsupported",
        fix: null,
        message: "這個瀏覽器不支援定位功能，請改用 Safari 或 Chrome。",
      });
      return;
    }

    // 定位只在 HTTPS 或 localhost 底下可用。用手機連電腦的開發伺服器
    // （像 http://192.168.x.x:5173）會直接被瀏覽器擋掉。
    if (!window.isSecureContext) {
      setState({
        status: "insecure",
        fix: null,
        message: "目前的連線不是 HTTPS，瀏覽器不允許定位。請改用正式網址開啟。",
      });
      return;
    }

    if (watchIdRef.current !== null) {
      return;
    }

    setState({ status: "locating", fix: null, message: null });

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          status: "tracking",
          fix: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          },
          message: null,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setState({
            status: "denied",
            fix: null,
            message: "你拒絕了定位權限。要重新開啟，請到瀏覽器的網站設定允許定位後重新整理。",
          });
          return;
        }
        if (error.code === error.POSITION_UNAVAILABLE) {
          setState({
            status: "error",
            fix: null,
            message: "目前收不到定位訊號。走到室外或建築物旁邊再試一次會比較容易定位。",
          });
          return;
        }
        setState({
          status: "error",
          fix: null,
          message: "定位逾時，請再試一次。",
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 20000,
      },
    );
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  return { ...state, start, stop };
}
