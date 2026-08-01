import { Link, useLocation, useNavigate } from "react-router-dom";
import { Award, LogIn, MapPinned, Sparkles } from "lucide-react";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoProgress } from "@/components/ui/NeoProgress";
import { useGame } from "@/hooks/useGame";

export function TopNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { completedCount, totalCheckpoints, source, isRedeemed, ready } = useGame();
  const compact = pathname === "/" || pathname === "/login";

  return (
    <header className="sticky top-0 z-30 border-b-4 border-ink bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 font-black">
            <span className="flex h-12 w-12 items-center justify-center rounded-neo border-4 border-ink bg-coral shadow-neo">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="text-lg">Checkpoint Quest</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <NeoBadge variant={source === "firebase" ? "success" : "warning"}>{source === "firebase" ? "Firebase" : "Local"}</NeoBadge>
            {isRedeemed ? <NeoBadge variant="success">已兌換</NeoBadge> : <NeoBadge variant={ready ? "info" : "warning"}>{ready ? "進行中" : "載入中"}</NeoBadge>}
          </div>
        </div>

        {!compact ? (
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <NeoProgress value={completedCount} max={totalCheckpoints} label="整體進度" />
            <div className="flex flex-wrap gap-2">
              <NeoButton type="button" variant="ghost" size="sm" onClick={() => navigate("/checkpoints")}>
                <MapPinned className="h-4 w-4" />
                任務列表
              </NeoButton>
              <NeoButton type="button" variant="secondary" size="sm" onClick={() => navigate("/redeem")}>
                <Award className="h-4 w-4" />
                Redeem
              </NeoButton>
              <NeoButton type="button" variant="ghost" size="sm" onClick={() => navigate("/login")}>
                <LogIn className="h-4 w-4" />
                登入
              </NeoButton>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
