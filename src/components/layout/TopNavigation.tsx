import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { NeoBadge } from "../ui/NeoBadge";

interface TopNavigationProps {
  score: number;
  total: number;
}

export function TopNavigation({ score, total }: TopNavigationProps) {
  return (
    <header className="sticky top-0 z-30 border-b-4 border-black bg-[#FFF6D6]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-black" aria-label="回到首頁">
          <Home />
          新生闖關
        </Link>
        <NeoBadge tone="info">分數 {score} / {total}</NeoBadge>
      </div>
    </header>
  );
}