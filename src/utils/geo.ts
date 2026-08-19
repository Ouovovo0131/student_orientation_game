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
export const CALIBRATION_POINTS: CalibrationPoint[] = [];

const METERS_PER_DEG_LAT = 110574;

function metersPerDegLng(lat: number): number {
  return 111320 * Math.cos((lat * Math.PI) / 180);
}

export interface MapProjection {
  /** 把經緯度換算成圖上的像素座標 */
  project: (lat: number, lng: number) => { x: number; y: number };
  /** 一公尺等於圖上幾個像素，用來畫定位誤差圈 */
  pixelsPerMeter: number;
}

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

  return {
    project(lat: number, lng: number) {
      const mx = (lng - lngRef) * mPerLng;
      const my = (lat - latRef) * METERS_PER_DEG_LAT;
      const px = kReal * mx - kImag * my;
      const py = kImag * mx + kReal * my;
      return { x: xRef + px, y: yRef - py };
    },
    pixelsPerMeter: Math.hypot(kReal, kImag),
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
