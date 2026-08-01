import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Home, ShieldCheck } from "lucide-react";
import { NeoButton } from "@/components/ui/NeoButton";
import { useGame } from "@/hooks/useGame";

export function BottomActionBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { nextCheckpoint, isComplete, isRedeemed } = useGame();

  if (pathname === "/loading" || pathname === "/error" || pathname === "/404") {
    return null;
  }

  return (
    <footer className="sticky bottom-0 z-30 border-t-4 border-ink bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="text-sm font-bold">
          {isRedeemed ? "已完成兌換" : isComplete ? "全部關卡已完成" : nextCheckpoint ? `下一關：${nextCheckpoint.title}` : "準備開始"}
        </div>
        <div className="flex flex-wrap gap-2">
          <NeoButton type="button" variant="ghost" size="sm" onClick={() => navigate("/")}>
            <Home className="h-4 w-4" />
            首頁
          </NeoButton>
          {!isComplete ? (
            <NeoButton type="button" variant="primary" size="sm" onClick={() => navigate("/checkpoints")}>
              <ShieldCheck className="h-4 w-4" />
              繼續闖關
            </NeoButton>
          ) : (
            <NeoButton type="button" variant="secondary" size="sm" onClick={() => navigate("/result")}>
              <ChevronRight className="h-4 w-4" />
              查看結果
            </NeoButton>
          )}
        </div>
      </div>
    </footer>
  );
}
