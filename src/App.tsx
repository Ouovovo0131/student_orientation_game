import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import { AppShell } from "@/components/layout/AppShell";
import { LandingPage } from "@/pages/Landing";
import { LoginPage } from "@/pages/Login";
import { CheckpointListPage } from "@/pages/CheckpointList";
import { CheckpointDetailPage } from "@/pages/CheckpointDetail";
import { VideoPage } from "@/pages/Video";
import { CompletionAnimationPage } from "@/pages/CompletionAnimation";
import { FinalResultPage } from "@/pages/FinalResult";
import { RedeemPage } from "@/pages/Redeem";
import { AlreadyRedeemedPage } from "@/pages/AlreadyRedeemed";
import { ChallengeFailedPage } from "@/pages/ChallengeFailed";
import { LoadingPage } from "@/pages/Loading";
import { ErrorPage } from "@/pages/Error";
import { NotFoundPage } from "@/pages/NotFound";

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/checkpoints" element={<CheckpointListPage />} />
            <Route path="/checkpoints/:checkpointId" element={<CheckpointDetailPage />} />
            <Route path="/checkpoints/:checkpointId/video" element={<VideoPage />} />
            <Route path="/completion/:checkpointId" element={<CompletionAnimationPage />} />
            <Route path="/result" element={<FinalResultPage />} />
            <Route path="/redeem" element={<RedeemPage />} />
            <Route path="/redeemed" element={<AlreadyRedeemedPage />} />
            <Route path="/failed" element={<ChallengeFailedPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}
