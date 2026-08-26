import { ArrowLeft, Crosshair, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useDeviceHeading } from "../hooks/useDeviceHeading";
import { useGeolocation } from "../hooks/useGeolocation";
import {
  buildProjection,
  CALIBRATION_POINTS,
  isInsideMap,
  MAP_IMAGE_HEIGHT,
  MAP_IMAGE_WIDTH,
  type CalibrationPoint,
} from "../utils/geo";

export function MapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCalibrating = searchParams.get("calibrate") === "1";

  const { status, fix, message, start, stop } = useGeolocation();
  const heading = useDeviceHeading();
  const [draftPoints, setDraftPoints] = useState<CalibrationPoint[]>([]);
  const [pendingFix, setPendingFix] = useState<{ lat: number; lng: number } | null>(null);

  const projection = useMemo(
    () => buildProjection(isCalibrating ? [...CALIBRATION_POINTS, ...draftPoints] : CALIBRATION_POINTS),
    [isCalibrating, draftPoints],
  );

  const marker = useMemo(() => {
    if (!fix || !projection) {
      return null;
    }
    const point = projection.project(fix.lat, fix.lng);
    return {
      ...point,
      radius: Math.max(fix.accuracy * projection.pixelsPerMeter, 12),
      inside: isInsideMap(point),
    };
  }, [fix, projection]);

  const isTracking = status === "locating" || status === "tracking";

  // 圖上的朝向角度。地圖不是正北朝上，所以要走 screenAngleForBearing 換算。
  const headingAngle = useMemo(() => {
    if (heading.heading === null || !projection) {
      return null;
    }
    return projection.screenAngleForBearing(heading.heading);
  }, [heading.heading, projection]);

  // iOS 的方位權限只能在使用者手勢裡要，所以跟定位綁在同一顆按鈕。
  function handleToggleTracking() {
    if (isTracking) {
      stop();
      heading.stop();
      return;
    }
    start();
    void heading.start(true);
  }

  // 一進頁面就開始定位，不用等他按按鈕。按鈕留著給他隨時關掉或重開。
  //
  // 方位這邊只在不需要授權的平台（Android、桌機）自動接上；iOS 一定要手勢才能
  // 要權限，所以那邊要等他按按鈕，箭頭才會出現。
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (autoStartedRef.current) {
      return;
    }
    autoStartedRef.current = true;
    start();
    void heading.start(false);
    // 只在掛載時跑一次；之後開關都由按鈕控制。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleMapClick(event: MouseEvent<SVGSVGElement>) {
    if (!isCalibrating || !pendingFix) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * MAP_IMAGE_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * MAP_IMAGE_HEIGHT;
    setDraftPoints((current) => [
      ...current,
      {
        // 接續 geo.ts 既有的編號，之後再進場補點時才不會跟現有的撞名。
        label: `校正點 ${CALIBRATION_POINTS.length + current.length + 1}`,
        lat: pendingFix.lat,
        lng: pendingFix.lng,
        x: Math.round(x),
        y: Math.round(y),
      },
    ]);
    setPendingFix(null);
  }

  return (
    <PageContainer className="max-w-5xl">
      <NeoButton
        type="button"
        variant="secondary"
        className="mb-4 px-4 py-2"
        onClick={() => navigate("/checkpoints")}
      >
        <ArrowLeft className="mr-1 inline" size={18} />
        返回上一頁
      </NeoButton>
      <NeoCard>
        <SectionTitle>校園地圖</SectionTitle>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <NeoButton
            type="button"
            className="px-4 py-2"
            onClick={handleToggleTracking}
          >
            {status === "locating" ? (
              <LoaderCircle className="mr-1 inline animate-spin" size={18} />
            ) : (
              <Crosshair className="mr-1 inline" size={18} />
            )}
            {isTracking ? "停止定位" : "顯示我的位置"}
          </NeoButton>

          {status === "tracking" && fix ? (
            <span className="text-sm font-bold">
              定位誤差約 {Math.round(fix.accuracy)} 公尺
            </span>
          ) : null}

          {isTracking && heading.heading !== null ? (
            <span className="text-sm font-bold">
              面向 {compassLabel(heading.heading)}
            </span>
          ) : null}
        </div>

        {isTracking && heading.message ? (
          <p className="mt-3 border-4 border-black bg-[#FFF8E8] p-3 text-sm font-bold">{heading.message}</p>
        ) : null}

        {message ? (
          <p className="mt-3 border-4 border-black bg-[#FF6A6A] p-3 text-sm font-bold">{message}</p>
        ) : null}

        {status === "locating" ? (
          <p className="mt-3 border-4 border-black bg-[#FFF8E8] p-3 text-sm font-bold">
            正在定位，請稍候。第一次可能需要十幾秒。
          </p>
        ) : null}

        {isTracking && !projection ? (
          <p className="mt-3 border-4 border-black bg-[#FFF8E8] p-3 text-sm font-bold">
            地圖尚未完成現場校正，所以還無法把你的位置標到圖上。校正方式請看
            <code className="mx-1">src/utils/geo.ts</code>。
          </p>
        ) : null}

        {marker && !marker.inside ? (
          <p className="mt-3 border-4 border-black bg-[#FFF8E8] p-3 text-sm font-bold">
            你目前不在校園範圍內，地圖上不會顯示位置。
          </p>
        ) : null}

        <div className="mt-4 overflow-auto border-4 border-black bg-white p-2">
          <div className="relative mx-auto w-full min-w-[640px]">
            <img
              src="/campus-map.png"
              alt="校園地圖"
              className="block h-auto w-full object-contain"
            />
            <svg
              viewBox={`0 0 ${MAP_IMAGE_WIDTH} ${MAP_IMAGE_HEIGHT}`}
              className={`absolute inset-0 h-full w-full ${isCalibrating ? "cursor-crosshair" : "pointer-events-none"}`}
              onClick={handleMapClick}
              aria-hidden={!marker}
            >
              {marker && marker.inside ? (
                <>
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r={marker.radius}
                    fill="rgba(59, 234, 125, 0.3)"
                    stroke="#000"
                    strokeWidth={4}
                  />
                  {headingAngle !== null ? (
                    <g transform={`rotate(${headingAngle} ${marker.x} ${marker.y})`}>
                      <path
                        d={`M ${marker.x} ${marker.y - 78}
                            L ${marker.x + 30} ${marker.y - 12}
                            L ${marker.x} ${marker.y - 26}
                            L ${marker.x - 30} ${marker.y - 12} Z`}
                        fill="#3BEA7D"
                        stroke="#000"
                        strokeWidth={6}
                        strokeLinejoin="round"
                      />
                    </g>
                  ) : null}
                  <circle cx={marker.x} cy={marker.y} r={18} fill="#3BEA7D" stroke="#000" strokeWidth={7} />
                </>
              ) : null}

              {isCalibrating
                ? [...CALIBRATION_POINTS, ...draftPoints].map((point, index) => (
                    <g key={`${point.x}-${point.y}-${index}`}>
                      <circle cx={point.x} cy={point.y} r={16} fill="#FFD644" stroke="#000" strokeWidth={6} />
                      <text x={point.x + 26} y={point.y + 8} fontSize={32} fontWeight="bold">
                        {index + 1}
                      </text>
                    </g>
                  ))
                : null}
            </svg>
          </div>
        </div>

        <p className="mt-3 text-sm">
          地圖北方朝左（見圖右下角指北針）。定位會有數公尺到十幾公尺的誤差，
          綠色圈圈是誤差範圍，站在建築物之間時誤差會更大。
          綠色箭頭是你正面朝的方向，手機請放平再看，靠近鐵欄杆或大型金屬時羅盤會飄。
        </p>

        {isCalibrating ? (
          <CalibrationPanel
            fix={fix}
            pendingFix={pendingFix}
            draftPoints={draftPoints}
            onCapture={() => fix && setPendingFix({ lat: fix.lat, lng: fix.lng })}
            onClear={() => {
              setDraftPoints([]);
              setPendingFix(null);
            }}
          />
        ) : null}
      </NeoCard>
    </PageContainer>
  );
}

const COMPASS_LABELS = ["北", "東北", "東", "東南", "南", "西南", "西", "西北"];

/** 把方位角換成「北」「東南」這種讀得懂的說法 */
function compassLabel(bearingDeg: number): string {
  const index = Math.round((((bearingDeg % 360) + 360) % 360) / 45) % 8;
  return COMPASS_LABELS[index];
}

interface CalibrationPanelProps {
  fix: { lat: number; lng: number } | null;
  pendingFix: { lat: number; lng: number } | null;
  draftPoints: CalibrationPoint[];
  onCapture: () => void;
  onClear: () => void;
}

/**
 * 現場校正用的面板，只有網址帶 ?calibrate=1 才會出現，一般玩家看不到。
 *
 * 流程：站到一個地標旁 → 按「記錄目前位置」→ 點地圖上你所在的位置 →
 * 換一個離得遠的地標再做一次 → 把產生的內容貼進 geo.ts 的 CALIBRATION_POINTS。
 */
function CalibrationPanel({ fix, pendingFix, draftPoints, onCapture, onClear }: CalibrationPanelProps) {
  const snippet = useMemo(
    () =>
      draftPoints
        .map(
          (point) =>
            `  { label: "${point.label}", lat: ${point.lat.toFixed(7)}, lng: ${point.lng.toFixed(7)}, x: ${point.x}, y: ${point.y} },`,
        )
        .join("\n"),
    [draftPoints],
  );

  return (
    <div className="mt-6 border-4 border-black bg-[#FFF8E8] p-4">
      <h3 className="text-lg font-black">校正模式</h3>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm font-bold">
        <li>站到一個地圖上找得到的地點（例如大門正中央）。</li>
        <li>按下方「記錄目前位置」。</li>
        <li>在上面的地圖點一下你現在站的位置。</li>
        <li>走到另一個離得越遠越好的地點，重複一次。</li>
        <li>把最下面產生的內容貼進 <code>src/utils/geo.ts</code>。</li>
      </ol>

      <div className="mt-4 flex flex-wrap gap-3">
        <NeoButton type="button" className="px-4 py-2" disabled={!fix} onClick={onCapture}>
          記錄目前位置
        </NeoButton>
        <NeoButton
          type="button"
          variant="danger"
          className="px-4 py-2"
          disabled={draftPoints.length === 0}
          onClick={onClear}
        >
          全部清除
        </NeoButton>
      </div>

      {!fix ? (
        <p className="mt-3 text-sm font-bold">請先按上面的「顯示我的位置」開始定位。</p>
      ) : null}

      {pendingFix ? (
        <p className="mt-3 border-4 border-black bg-[#3BEA7D] p-3 text-sm font-black">
          已記錄座標，現在請點一下地圖上你所在的位置。
        </p>
      ) : null}

      {draftPoints.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm font-bold">
            已有 {draftPoints.length} 個校正點{draftPoints.length < 2 ? "（至少要兩個）" : ""}：
          </p>
          <pre className="mt-2 overflow-x-auto border-4 border-black bg-white p-3 text-xs">
            <code>{snippet}</code>
          </pre>
        </div>
      ) : null}
    </div>
  );
}
