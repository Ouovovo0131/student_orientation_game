import { Home, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useGame } from "../../hooks/useGame";
import { NeoButton } from "../ui/NeoButton";
import { NeoBadge } from "../ui/NeoBadge";

interface TopNavigationProps {
  score: number;
  total: number;
}

export function TopNavigation({ score, total }: TopNavigationProps) {
  const { uid, player } = useGame();
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
          {player?.playerUid && <NeoBadge tone="success">玩家 UID {player.playerUid}</NeoBadge>}
          {uid && isAdmin && (
            <>
              <Link to="/admin/checkpoints">
                <NeoButton variant="secondary" className="min-h-0 px-3 py-2 text-sm">
                  關卡管理
                </NeoButton>
              </Link>
              <Link to="/admin/redeem">
                <NeoButton variant="primary" className="min-h-0 px-3 py-2 text-sm">
                  兌換管理
                </NeoButton>
              </Link>
            </>
          )}
          {uid && (
            <Link to="/account">
              <NeoButton variant="secondary" className="min-h-0 px-3 py-2 text-sm">
                <UserRound className="mr-1 inline" size={16} /> 帳號
              </NeoButton>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}