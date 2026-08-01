import cors from "cors";
import express from "express";
import gameRoutes from "./routes/gameRoutes";

const app = express();
const port = Number(process.env.PORT ?? 8787);

app.use(cors());
app.use(express.json());
app.use("/api", gameRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true, message: "服務正常" });
});

app.listen(port, () => {
  console.log(`伺服器已啟動：http://localhost:${port}`);
});