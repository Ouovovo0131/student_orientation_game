import type { Checkpoint } from "../types";

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: "welcome-01",
    title: "校園安全導覽",
    description: "觀看校園安全影片，完成後自動記錄分數。",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "library-02",
    title: "圖書館服務介紹",
    description: "認識借閱規範與數位資源入口。",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "clubs-03",
    title: "社團資源總覽",
    description: "瞭解社團活動、器材借用與經費流程。",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
];