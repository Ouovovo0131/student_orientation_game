import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const checkpoints = [
  { id: "welcome", title: "歡迎報到", order: 1 },
  { id: "map", title: "校園導覽", order: 2 },
  { id: "safety", title: "安全守則", order: 3 },
  { id: "club", title: "社團探索", order: 4 },
  { id: "final", title: "最終挑戰", order: 5 },
];

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "checkpoint-quest-api" });
});

app.get("/api/checkpoints", (_req, res) => {
  res.json({ checkpoints });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
