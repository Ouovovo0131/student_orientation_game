/**
 * 把 GPS 座標對應到校園地圖圖檔上的像素位置。
 *
 * 地圖是示意平面圖，而且北方朝左（見圖右下角指北針），所以不能直接把經緯度
 * 當成 x/y 使用。這裡的做法是用「相似變換」：由現場校正點推算出一組旋轉 +
 * 縮放參數，再把任何一組經緯度換算成圖上的像素座標。
 *
 * 校正方式見 CALIBRATION_POINTS 的說明。
 */

export const MAP_IMAGE_WIDTH = 2000;
export const MAP_IMAGE_HEIGHT = 1414;

export interface CalibrationPoint {
  /** 這個點在哪，純粹給人看的備註 */
  label: string;
  /** 實際緯度，例如 23.98xxxx */
  lat: number;
  /** 實際經度，例如 121.60xxxx */
  lng: number;
  /** 對應到地圖圖檔上的像素座標（左上角為 0,0，右下角為 2000,1414） */
  x: number;
  y: number;
}

/**
 * 現場校正點。至少要兩個，越分散越準（建議挑對角線的兩端，例如大門和藝能大樓）。
 *
 * 取得方式：帶手機到該地點，打開 /map?calibrate=1，按「記錄目前位置」，
 * 再點一下地圖上你所在的位置，頁面就會產生可以直接貼進這個陣列的內容。
 *
 * 陣列空著或不足兩點時，定位功能會顯示「尚未校正」而不會顯示錯誤的位置。
 */
export const CALIBRATION_POINTS: CalibrationPoint[] = [
  { label: "校正點 1", lat: 23.9867852, lng: 121.6252798, x: 1156, y: 1066 },
  { label: "校正點 2", lat: 23.9866245, lng: 121.6255120, x: 1147, y: 725 },
  // 校正點 3 是全部 12 點裡唯一在南邊的（比其他點南 55 公尺），單獨扛著藝能大樓
  // 那一區的資訊。它的殘差偏大不是因為點歪，而是這張示意圖不是等比例畫的，
  // 全域變換抓不到局部變形 —— 這正是下面加上局部殘差修正的原因。
  { label: "校正點 3", lat: 23.9857247, lng: 121.6251916, x: 1788, y: 291 },
  { label: "校正點 4", lat: 23.9862183, lng: 121.6255215, x: 1425, y: 284 },
  { label: "校正點 5", lat: 23.9864789, lng: 121.6257161, x: 1156, y: 353 },
  { label: "校正點 6", lat: 23.9867097, lng: 121.6257140, x: 697, y: 506 },
  { label: "校正點 7", lat: 23.9868681, lng: 121.6258341, x: 569, y: 519 },
  { label: "校正點 8", lat: 23.9869805, lng: 121.6259476, x: 425, y: 516 },
  { label: "校正點 9", lat: 23.9872592, lng: 121.6260026, x: 178, y: 800 },
  { label: "校正點 10", lat: 23.9871059, lng: 121.6257001, x: 369, y: 1009 },
  { label: "校正點 11", lat: 23.9869896, lng: 121.6256170, x: 534, y: 1000 },
  { label: "校正點 12", lat: 23.9868769, lng: 121.6254934, x: 725, y: 1006 },
];

const METERS_PER_DEG_LAT = 110574;

function metersPerDegLng(lat: number): number {
  return 111320 * Math.cos((lat * Math.PI) / 180);
}

export interface MapProjection {
  /** 把經緯度換算成圖上的像素座標 */
  project: (lat: number, lng: number) => { x: number; y: number };
  /** 一公尺等於圖上幾個像素，用來畫定位誤差圈 */
  pixelsPerMeter: number;
  /**
   * 把羅盤方位角（正北為 0，順時針到 360）換算成圖面上的旋轉角度。
   * 因為地圖不是正北朝上，使用者面向北方時圖上的箭頭不能畫成朝上。
   */
  screenAngleForBearing: (bearingDeg: number) => number;
}

/**
 * 局部殘差修正的作用半徑（公尺）。
 *
 * 校園示意圖不是等比例畫的 —— 建築物被放大、空地被壓縮，而且各區不一致，
 * 所以單一個全域相似變換一定會有系統性的偏差。這裡的做法是先算全域解，
 * 再用附近校正點的殘差做距離加權補償；超出半徑就自然退回全域解。
 *
 * 試過改用薄板樣條（可以完美穿過每個校正點），但校正點外圍的外插會爆炸，
 * 留一交叉驗證 RMS 高達 108 公尺，實際上不能用。
 */
const LOCAL_CORRECTION_RADIUS_M = 100;

/**
 * 由校正點推算投影參數。
 *
 * 把「東 / 北」的公尺位移看成複數 m，把像素位移（y 軸翻轉成向上為正）看成複數 p，
 * 兩者的關係就是一個複數乘法 p = k · m —— k 的絕對值是縮放、輻角是旋轉。
 * 用最小平方法解 k，兩點時剛好是精確解，三點以上會自動取最佳配適。
 */
export function buildProjection(points: CalibrationPoint[]): MapProjection | null {
  if (points.length < 2) {
    return null;
  }

  const latRef = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const lngRef = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  const xRef = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const yRef = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  const mPerLng = metersPerDegLng(latRef);

  let numeratorReal = 0;
  let numeratorImag = 0;
  let denominator = 0;

  for (const point of points) {
    // 公尺位移：東為 +x，北為 +y
    const mx = (point.lng - lngRef) * mPerLng;
    const my = (point.lat - latRef) * METERS_PER_DEG_LAT;
    // 像素位移：圖片 y 軸向下，翻轉成向上為正才能跟公尺同一個座標系
    const px = point.x - xRef;
    const py = -(point.y - yRef);

    // p · conj(m)
    numeratorReal += px * mx + py * my;
    numeratorImag += py * mx - px * my;
    denominator += mx * mx + my * my;
  }

  if (denominator === 0) {
    return null;
  }

  const kReal = numeratorReal / denominator;
  const kImag = numeratorImag / denominator;

  function globalProject(mx: number, my: number) {
    const px = kReal * mx - kImag * my;
    const py = kImag * mx + kReal * my;
    return { x: xRef + px, y: yRef - py };
  }

  function toMeters(lat: number, lng: number) {
    return { mx: (lng - lngRef) * mPerLng, my: (lat - latRef) * METERS_PER_DEG_LAT };
  }

  // 每個校正點在全域解之下差了多少像素，之後用來做局部補償。
  const residuals = points.map((point) => {
    const { mx, my } = toMeters(point.lat, point.lng);
    const predicted = globalProject(mx, my);
    return { mx, my, dx: point.x - predicted.x, dy: point.y - predicted.y };
  });

  return {
    project(lat: number, lng: number) {
      const { mx, my } = toMeters(lat, lng);
      const base = globalProject(mx, my);

      let weightSum = 0;
      let shiftX = 0;
      let shiftY = 0;
      for (const residual of residuals) {
        const distance = Math.hypot(mx - residual.mx, my - residual.my);
        if (distance > LOCAL_CORRECTION_RADIUS_M) {
          continue;
        }
        // 越近權重越大，到達半徑時剛好衰減為 0，所以不會在邊界跳動。
        const falloff = (1 - distance / LOCAL_CORRECTION_RADIUS_M) ** 2;
        const weight = falloff / Math.max(distance * distance, 1);
        weightSum += weight;
        shiftX += weight * residual.dx;
        shiftY += weight * residual.dy;
      }

      if (weightSum === 0) {
        return base;
      }
      return { x: base.x + shiftX / weightSum, y: base.y + shiftY / weightSum };
    },
    pixelsPerMeter: Math.hypot(kReal, kImag),
    screenAngleForBearing(bearingDeg: number) {
      const rad = (bearingDeg * Math.PI) / 180;
      // 方位角拆成東 / 北兩個分量，再走跟座標同一條變換。
      const mx = Math.sin(rad);
      const my = Math.cos(rad);
      const px = kReal * mx - kImag * my;
      const py = kImag * mx + kReal * my;
      // 圖面上「朝上」是 y 變小的方向，所以這裡用 (px, py) 算順時針角度。
      return (Math.atan2(px, py) * 180) / Math.PI;
    },
  };
}

/** 允許超出圖面多少像素仍算在校園內，避免站在校門口邊緣就被判定為校外 */
const OUT_OF_BOUNDS_MARGIN = 200;

export function isInsideMap(point: { x: number; y: number }): boolean {
  return (
    point.x >= -OUT_OF_BOUNDS_MARGIN
    && point.x <= MAP_IMAGE_WIDTH + OUT_OF_BOUNDS_MARGIN
    && point.y >= -OUT_OF_BOUNDS_MARGIN
    && point.y <= MAP_IMAGE_HEIGHT + OUT_OF_BOUNDS_MARGIN
  );
}
