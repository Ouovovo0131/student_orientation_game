import type { Checkpoint } from "../types";

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: "stage-01",
    title: "關卡 1：疾風競技場 | 體育組",
    description: "體育課程、籌辦運動賽事與管理體育器材。",
    videoUrl: "https://youtu.be/eTqa78gU5B8?si=jcTPq567jNP5KYe_",
    quiz: {
      prompt: "以下關於體育組的資訊哪像正確？",
      options: ["游泳佔比相對來說比較重", "四樓為音樂教室以及社團辦公室", "四樓為音樂教室", "進到體育組要從左側門口進入"],
      answerIndex: 0,
      explanation: "四樓為美術教室、進體育組要從右側門口進入、游泳很重要!!!。",
    },
  },
  {
    id: "stage-02",
    title: "關卡 2：生命聖殿 | 健康中心",
    description: "傷病處理、健康檢查與衛生教育。",
    videoUrl: "https://youtu.be/7o4Z9C5wk2U?si=Y_l3K94dH5uoP2WH",
    quiz: {
      prompt: "以下關於健康中心的資訊哪項錯誤？",
      options: ["健康中心沒開門要在門口等阿姨來", "校安專線是03-8242601", "健康中心製冰機的冰不能吃", "需要借口罩可以到健康中心借"],
      answerIndex: 0,
      explanation: "健康中心沒開門要去學務處請老師幫忙。",
    },
  },
  {
    id: "stage-03",
    title: "關卡 3：心靈迷宮 | 輔導室",
    description: "心理諮商與生涯發展指引。",
    videoUrl: "https://youtu.be/WqubInH-2KY?si=0gmCXwdOiteLGZro",
    quiz: {
      prompt: "輔導室位在校園哪一棟第幾層？",
      options: ["和平樓2樓", "綜合大樓1樓", "和平樓三樓", "仁愛樓3樓"],
      answerIndex: 2,
      explanation: "輔導室在和平樓的三樓(大導辦樓上)。",
    },
  },
  {
    id: "stage-04",
    title: "關卡 4：花中地下城 | 合作社",
    description: "餐飲小點、文具用品與不定時刷新的隨機事件。",
    videoUrl: "https://www.youtube.com/shorts/L8xpO3aQ0Pw",
    quiz: {
      prompt: "以下關於合作社的資訊哪項錯誤？",
      options: ["有零食飲料可以購買", "購物前須要先準備好零錢", "購物完要走走道離開", "合作社阿姨人很兇"],
      answerIndex: 3,
      explanation: "阿姨一定是最~有耐心脾氣最好的姐姐。",
    },
  },
  {
    id: "stage-05",
    title: "關卡 5：智慧神殿 | 教務處",
    description: "統籌課程規劃、考試成績與升學事務。",
    videoUrl: "https://www.youtube.com/shorts/U1Wvt9zSEv0",
    quiz: {
      prompt: "教務處有甚麼組別？",
      options: ["訓育組", "衛生組", "註冊組", "體育組"],
      answerIndex: 2,
      explanation: "訓育組以及衛生組是學務處的。",
    },
  },
  {
    id: "stage-06",
    title: "關卡 6：秩序裁決所 | 學務處",
    description: "生活常規、社團活動與校園安全。",
    videoUrl: "https://youtu.be/WqubInH-2KY?si=0gmCXwdOiteLGZro",
    quiz: {
      prompt: "高一學創老師是？",
      options: ["陳德剛老師 + 王清平老師", "陳德剛老師 + 李婕老師", "陳德剛老師 + 劉俊恩老師", "陳德剛老師 + 李曉薇老師"],
      answerIndex: 0,
      explanation: "高一的學創老師記清楚，是德剛老師跟清平老師喔。",
    },
  },
  {
    id: "stage-07",
    title: "關卡 7：萬卷禁庫書 | 圖書館",
    description: "提供豐富藏書、寧靜的自習空間與資訊檢索服務。",
    videoUrl: "https://youtu.be/eTqa78gU5B8?si=jcTPq567jNP5KYe_",
    quiz: {
      prompt: "以下關於圖書館的資訊哪項錯誤？",
      options: ["可以自習k書", "舉辦花中文學獎", "參加數學奧林匹亞培訓", "詢問段考、總成績"],
      answerIndex: 3,
      explanation: "段考跟成績是教務處的業務喔。",
    },
  },
];