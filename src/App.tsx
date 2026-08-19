import { useEffect, type ReactElement } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { TopNavigation } from "./components/layout/TopNavigation";
import { StatusBanner } from "./components/ui/StatusBanner";
import { useGame } from "./hooks/useGame";
import { AccountPage } from "./pages/AccountPage";
import { AlreadyRedeemedPage } from "./pages/AlreadyRedeemedPage";
import { ChallengeFailedPage } from "./pages/ChallengeFailedPage";
import { CheckpointDetailPage } from "./pages/CheckpointDetailPage";
import { CheckpointListPage } from "./pages/CheckpointListPage";
import { CheckpointManagementPage } from "./pages/CheckpointManagementPage";
import { CompletionAnimationPage } from "./pages/CompletionAnimationPage";
import { ErrorPage } from "./pages/ErrorPage";
import { FinalResultPage } from "./pages/FinalResultPage";
import { LandingPage } from "./pages/LandingPage";
import { LoadingPage } from "./pages/LoadingPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { QuizPage } from "./pages/QuizPage";
import { RedeemManagementPage } from "./pages/RedeemManagementPage";
import { RedeemPage } from "./pages/RedeemPage";
import { UnlockPage } from "./pages/UnlockPage";
import { VideoPage } from "./pages/VideoPage";

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { uid } = useGame();
  const location = useLocation();

  if (!uid) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  return children;
}

export default function App() {
  const {
    player,
    totalCheckpoints,
    refreshPlayer,
    refreshRedeemControl,
    uid,
    loading,
    taskMessage,
    error,
  } = useGame();

  useEffect(() => {
    if (!uid) {
      return;
    }

    void (async () => {
      try {
        await refreshPlayer();
        await refreshRedeemControl();
      } catch {
        // 錯誤訊息已在 GameContext 設定，此處避免未捕捉 Promise 例外。
      }
    })();
  }, [uid, refreshPlayer, refreshRedeemControl]);

  return (
    <div className="min-h-screen bg-neo-paper pb-24">
      <TopNavigation score={player?.score ?? 0} total={totalCheckpoints} />
      <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
        <StatusBanner loading={loading} taskMessage={taskMessage} error={error} />
      </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/unlock/:levelId" element={<UnlockPage />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkpoints"
          element={
            <ProtectedRoute>
              <CheckpointListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkpoints/:id"
          element={
            <ProtectedRoute>
              <CheckpointDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:id"
          element={
            <ProtectedRoute>
              <VideoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/completion"
          element={
            <ProtectedRoute>
              <CompletionAnimationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <FinalResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/redeem"
          element={
            <ProtectedRoute>
              <RedeemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/checkpoints"
          element={
            <ProtectedRoute>
              <CheckpointManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/redeem"
          element={
            <ProtectedRoute>
              <RedeemManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/redeemed"
          element={
            <ProtectedRoute>
              <AlreadyRedeemedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/failed"
          element={
            <ProtectedRoute>
              <ChallengeFailedPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}