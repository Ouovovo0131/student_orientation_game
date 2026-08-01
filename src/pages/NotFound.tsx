import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <NeoCard className="space-y-4 p-8 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-black/60">404</p>
        <h1 className="text-4xl font-black">找不到頁面</h1>
        <p className="text-sm leading-6 text-black/70">你目前前往的路徑不存在，請回到首頁繼續遊戲。</p>
        <NeoButton type="button" onClick={() => navigate("/")}>
          <Home className="h-4 w-4" />
          回首頁
        </NeoButton>
      </NeoCard>
    </div>
  );
}
