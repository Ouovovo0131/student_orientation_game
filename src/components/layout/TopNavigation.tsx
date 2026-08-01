import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../../hooks/useGame";
import { NeoButton } from "../ui/NeoButton";
import { NeoBadge } from "../ui/NeoBadge";

interface TopNavigationProps {
  score: number;
  total: number;
}

export function TopNavigation({ score, total }: TopNavigationProps) {
  const navigate = useNavigate();
  const { uid, player, logout, loading } = useGame();
  const isAdmin = player?.role === "admin";

  return (
    <header className="sticky top-0 z-30 border-b-4 border-black bg-[#FFF6D6]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-black" aria-label="回到首頁">
          <Home />
          新生闖關
        </Link>
        <div className="flex items-center gap-3">
          <NeoBadge tone="info">分數 {score} / {total}</NeoBadge>
          {uid && isAdmin && (
            <Link to="/redeem">
              <NeoButton variant="primary" className="min-h-0 px-3 py-2 text-sm">
                前往兌換頁
              </NeoButton>
            </Link>
          )}
          {uid && (
            <NeoButton
              variant="secondary"
              disabled={loading}
              className="min-h-0 px-3 py-2 text-sm"
              onClick={async () => {
                await logout();
                navigate("/login", { replace: true });
              }}
            >
              登出
            </NeoButton>
          )}
        </div>
      </div>
    </header>
  );
}