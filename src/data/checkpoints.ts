import type { Checkpoint } from "@/types";

export const checkpoints: Checkpoint[] = [
  {
    id: "welcome",
    title: "歡迎報到",
    description: "先認識這個校園任務的玩法，聽完簡介後才能進入下一站。",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    rewardLabel: "新手徽章",
    order: 1,
    accent: "acid",
  },
  {
    id: "map",
    title: "校園導覽",
    description: "掌握教室、餐廳與服務櫃台的位置，避免迷路。",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    rewardLabel: "導覽貼紙",
    order: 2,
    accent: "sky",
  },
  {
    id: "safety",
    title: "安全守則",
    description: "完成安全影片後，才能獲得挑戰進度。",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    rewardLabel: "安全卡片",
    order: 3,
    accent: "coral",
  },
  {
    id: "club",
    title: "社團探索",
    description: "看完社團介紹後，決定你要先參加哪一個社群。",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    rewardLabel: "社團章",
    order: 4,
    accent: "violet",
  },
  {
    id: "final",
    title: "最終挑戰",
    description: "最後一段影片完成後，挑戰才算正式結束。",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    rewardLabel: "終章徽記",
    order: 5,
    accent: "gold",
  },
];
