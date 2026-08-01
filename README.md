# 新生定向闖關遊戲

這個專案包含前端 React 應用與後端 Express API，符合以下核心規則：

- 只有影片播放完畢後才會 +1 分
- Firestore 為唯一真實資料來源
- 兌換使用 Firestore Transaction，避免重複兌換
- 前端使用統一 Neo-Brutalism 設計系統
- 全站包含中文錯誤訊息與目前任務提示

## 啟動步驟

1. 安裝 Node.js 20+
2. 在根目錄執行 `npm install`
3. 在 `server` 目錄執行 `npm install`
4. 依 `.env.example` 建立 `.env`
5. 根目錄執行 `npm run dev`
6. 另一個終端機執行 `npm run server:dev`

## Firebase 文件結構

使用 `players/{uid}` 文件，預設內容：

```json
{
  "score": 0,
  "isRedeemed": false,
  "redeemTime": null,
  "completedStages": {}
}
```

## 注意

目前工作環境未安裝 Node.js，因此此提交僅完成程式碼與結構生成，尚未在本機執行 build/test。