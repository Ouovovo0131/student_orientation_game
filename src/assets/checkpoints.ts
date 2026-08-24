import type { Checkpoint } from "../types";

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: "stage-01",
    title: "關卡 1：疾風競技場 | 體育組",
    description: "體育課程、籌辦運動賽事與管理體育器材。",
    videoUrl: "https://www.youtube.com/shorts/zMO90DAdGKw",
    quiz: {
      prompt: "以下關於體育組的資訊哪像正確？",
      options: ["A: 游泳佔比相對來說比較重", "B: 四樓為音樂教室以及社團辦公室", "C: 四樓為音樂教室", "D: 進到體育組要從左側門口進入"],
      answerIndex: 0,
      explanation: "四樓為美術教室、進體育組要從右側門口進入、游泳很重要!!!。",
    },
  },
  {
    id: "stage-02",
    title: "關卡 2：生命聖殿 | 健康中心",
    description: "傷病處理、健康檢查與衛生教育。",
    videoUrl: "https://youtu.be/ten8SuISPVg",
    staffPasscode: {
      staffLabel: "健康中心醫療組人員",
      instruction: "請前往健康中心，向醫療組人員完成 Q&A 問答，並取得通關密碼後在下方輸入完成關卡。",
    },
  },
  {
    id: "stage-03",
    title: "關卡 3：心靈迷宮 | 輔導室",
    description: "心理諮商與生涯發展指引。",
    videoUrl: "https://www.youtube.com/watch?v=K-egIu6O9AI",
    quiz: {
      prompt: "輔導室位在校園哪一棟第幾層？",
      options: ["A: 和平樓2樓", "B: 綜合大樓1樓", "C: 和平樓三樓", "D: 仁愛樓3樓"],
      answerIndex: 2,
      explanation: "輔導室在和平樓的三樓(大導辦樓上)。",
    },
  },
  {
    id: "stage-04",
    title: "關卡 4：花中地下城 | 合作社",
    description: "餐飲小點、文具用品與不定時刷新的隨機事件。",
    videoUrl: "https://www.youtube.com/watch?v=JhS64xywEE8",
    quiz: {
      prompt: "以下關於合作社的資訊哪項錯誤？",
      options: ["A: 有零食飲料可以購買", "B: 購物前須要先準備好零錢", "C: 購物完要走走道離開", "D: 購買商品時不需穿校服"],
      answerIndex: 3,
      explanation: "去合作社一定要穿校服。",
    },
  },
  {
    id: "stage-05",
    title: "關卡 5：智慧神殿 | 教務處",
    description: "統籌課程規劃、考試成績與升學事務。",
    videoUrl: "https://www.youtube.com/shorts/I-lSbYZOFLI",
    quiz: {
      prompt: "教務處有甚麼組別？",
      options: ["A: 訓育組", "B: 衛生組", "C: 註冊組", "D: 體育組"],
      answerIndex: 2,
      explanation: "訓育組以及衛生組是學務處的。",
    },
  },
  {
    id: "stage-06",
    title: "關卡 6：秩序裁決所 | 學務處",
    description: "生活常規、社團活動與校園安全。",
    videoUrl: "https://www.youtube.com/watch?v=ZnECuuwq8ac",
    quiz: {
      prompt: "高一繳交假卡要找哪一位學創老師？",
      options: ["A: 陳德剛老師", "B: 李婕老師", "C: 劉俊恩老師", "D: 李曉薇老師"],
      answerIndex: 0,
      explanation: "高一的學創老師要記清楚，是德剛老師跟清平老師。",
    },
  },
  {
    id: "stage-07",
    title: "關卡 7：萬卷禁庫書 | 圖書館",
    description: "提供豐富藏書、寧靜的自習空間與資訊檢索服務。",
    videoUrl: "https://www.youtube.com/watch?v=hlZI3T-rOcQ",
    quiz: {
      prompt: "以下關於圖書館的資訊哪項錯誤？",
      options: ["A: 可以報名晚自習", "B: 可以報名圖書館志工", "C: 可以報名午間師生讀書會", "D: 借書不用帶學生證"],
      answerIndex: 3,
      explanation: "借書一定要帶學生證，圖書館的晚自習、志工、午間師生讀書會都可以報名參加。",
    },
  },
];