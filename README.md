# 新生定向闖關遊戲

這個專案包含前端 React 應用與後端 Express API，符合以下核心規則：

- 只有影片播放完畢後才會 +1 分
- Firestore 為唯一真實資料來源
- 兌換使用 Firestore Transaction，避免重複兌換
- 前端使用統一 Neo-Brutalism 設計系統
- 全站包含中文錯誤訊息與目前任務提示
- 登入需使用學校帳號，電子郵件必須以 `@hlhs.hlc.edu.tw` 結尾
- 玩家進度由前端 Firestore SDK 存取；管理操作與數字 UID 配發由後端 API 處理

## UID 說明

- `players/{文件ID}` 仍使用 Firebase Auth UID（英數混合）作為資料主鍵。
- 每位玩家另有 `playerUid`（純數字），例如 `11500001`、`11500002`。
- `playerUid` 由伺服器交易配發，確保唯一且遞增。
- 管理頁可使用數字 UID、Email 或 Firebase Auth UID 查找玩家。
- 管理頁提供「補齊所有缺少數字 UID 的玩家」按鈕，可一次回填既有資料。

## 啟動步驟

1. 安裝 Node.js 20+
2. 在根目錄執行 `npm install`
3. 在 `server` 目錄執行 `npm install`
4. 依 `.env.example` 建立 `.env`
5. 根目錄執行 `npm run dev`
6. 另一個終端機執行 `npm run server:dev`

若前端與後端不是同網域部署，請額外設定：

- `VITE_SERVER_API_BASE_URL`（例如 `https://your-server.example.com/api`）

## Firebase 文件結構

使用 `players/{authUid}` 文件，預設內容：

```json
{
  "playerUid": 11500001,
  "score": 0,
  "isRedeemed": false,
  "redeemTime": null,
  "redeemRequested": false,
  "redeemRequestTime": null,
  "completedStages": {},
  "unlockedStages": {},
  "account": "student@hlhs.hlc.edu.tw",
  "role": "player"
}
```

## 注意

目前工作環境未安裝 Node.js，因此此提交僅完成程式碼與結構生成，尚未在本機執行 build/test。

## Vercel 部署設定

- Project Settings -> Environment Variables 請設定：
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- Firebase Authentication 請啟用 Google 登入，並限制使用學校網域帳號。
- Node.js 版本建議使用 20 以上（已在 `package.json` 設定 `engines`）。
- Firebase Authentication 請啟用 Google 登入，並在 Authorized domains 加入你的 Vercel 網域。

若使用本專案內建的 `/api/*` 管理端點（Vercel Functions），還需要在 Vercel 設定：

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`（請貼上完整金鑰，含換行；若由單行貼入需保留 `\n`）

## Firestore 安全規則建議

前端直連 Firestore 時，請至少設定以下方向：

- 只允許已登入使用者存取自己的 `players/{uid}`
- `score` 只能遞增且每次最多 +1
- `completedStages` 只能新增 `true`，不可回寫 `false`
- `isRedeemed` 只能由 `false` 變成 `true`

目前專案已提供可直接套用的規則檔：`firestore.rules`。

套用方式：

1. 開啟 Firebase Console -> Firestore Database -> Rules
2. 將 `firestore.rules` 全部內容貼上並發布
3. 重新登入一次遊戲（讓最新 auth token 生效）

若仍出現 `permission-denied`，先確認：

- 登入帳號是否為 `@hlhs.hlc.edu.tw`
- Firestore 實際讀寫路徑是否為 `players/{uid}`
- 規則是否真的已發布到目前使用的 Firebase 專案

## 管理員權限設定

目前角色來源為 Firestore 的 `admins/{uid}`：

- 若存在 `admins/{uid}` 文件，該帳號角色為 `admin`
- 否則角色為 `player`

建議設定流程：

1. 先使用目標管理員 Google 帳號登入一次，取得對應 uid
2. 在 Firestore 建立文件 `admins/{uid}`（內容可留空或加註記欄位）
3. 重新登入後，兌換頁會出現管理員控制台，可開關兌換並設定 QR code 連結