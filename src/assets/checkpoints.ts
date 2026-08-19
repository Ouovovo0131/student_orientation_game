import type { Checkpoint } from "../types";

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: "stage-01",
    title: "關卡 1：疾風競技場 | 體育組",
    description: "這是新生闖關的起點，影片結束後請完成快問快答。",
    videoUrl: "https://youtu.be/eTqa78gU5B8?si=jcTPq567jNP5KYe_",
    quiz: {
      prompt: "請選出新生導覽的第一個重點：",
      options: ["校園地圖與入口", "社團招募會", "宿舍設備展示", "餐廳訂位"],
      answerIndex: 0,
      explanation: "新生導覽第一關以校園入口與地圖為主。",
    },
  },
  {
    id: "stage-02",
    title: "關卡 2：生命聖殿 | 保健室",
    description: "了解校園生活的基本規則，完成後即可解鎖下一關。",
    videoUrl: "https://youtu.be/7o4Z9C5wk2U?si=Y_l3K94dH5uoP2WH",
    quiz: {
      prompt: "以下哪一項最符合本關的重點？",
      options: ["上課準時", "社團招募", "校內打卡", "購物優惠"],
      answerIndex: 0,
      explanation: "本關聚焦基本的校園規則與守時觀念。",
    },
  },
  {
    id: "stage-03",
    title: "關卡 3：心靈迷宮 | 輔導室",
    description: "認識學校資訊系統與服務入口，請完成快問快答。",
    videoUrl: "https://youtu.be/WqubInH-2KY?si=0gmCXwdOiteLGZro",
    quiz: {
      prompt: "哪一項是本關要學的服務入口？",
      options: ["學校資訊系統", "社團公告欄", "學生會網站", "寄宿家庭平台"],
      answerIndex: 0,
      explanation: "本關重點是認識校務資訊系統。",
    },
  },
  {
    id: "stage-04",
    title: "關卡 4：花中地下城 | 合作社",
    description: "透過影片了解活動與活動流程，完成後即可繼續闖關。",
    videoUrl: "https://youtu.be/eTqa78gU5B8?si=jcTPq567jNP5KYe_",
    quiz: {
      prompt: "本關最重要的內容是什麼？",
      options: ["活動流程與體驗", "課堂安排", "補考規則", "社團經費"],
      answerIndex: 0,
      explanation: "本關以活動流程和體驗為重點。",
    },
  },
  {
    id: "stage-05",
    title: "關卡 5：智慧神殿 | 教務處",
    description: "認識學校提供的各項資源，影片尾聲會出現快問快答。",
    videoUrl: "https://youtu.be/7o4Z9C5wk2U?si=Y_l3K94dH5uoP2WH",
    quiz: {
      prompt: "本關介紹的是哪一類資源？",
      options: ["校園資源與服務", "戶外運動課", "後勤採購", "校外實習"],
      answerIndex: 0,
      explanation: "關卡五主要介紹校園資源與服務。",
    },
  },
  {
    id: "stage-06",
    title: "關卡 6：秩序裁決所 | 學務處",
    description: "了解學習與輔導資源，完成後會自動開啟下一關。",
    videoUrl: "https://youtu.be/WqubInH-2KY?si=0gmCXwdOiteLGZro",
    quiz: {
      prompt: "本關的重點是什麼？",
      options: ["學習支持與輔導", "餐廳營業時間", "交通資訊", "考試時程"],
      answerIndex: 0,
      explanation: "本關聚焦學習支持與輔導資源。",
    },
  },
  {
    id: "stage-07",
    title: "關卡 7：萬卷禁庫書",
    description: "從影片中了解校園生活適應方式，請回答問題。",
    videoUrl: "https://youtu.be/eTqa78gU5B8?si=jcTPq567jNP5KYe_",
    quiz: {
      prompt: "哪一項是本關的主要內容？",
      options: ["生活適應與自我管理", "校車時刻表", "教師評鑑", "社團比賽"],
      answerIndex: 0,
      explanation: "這一關在幫助新生適應校園生活。",
    },
  },
];