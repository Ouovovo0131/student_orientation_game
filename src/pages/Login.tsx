import { useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck } from "lucide-react";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { useGame } from "@/hooks/useGame";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, source } = useGame();

  async function handleLogin() {
    await signIn();
    navigate("/checkpoints");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
      <div className="space-y-5">
        <NeoBadge variant={source === "firebase" ? "success" : "warning"}>匿名登入</NeoBadge>
        <SectionTitle title="先登入，再開始記錄進度。" description="如果 Firebase 設定存在，會自動使用匿名登入；否則會啟用本機模擬模式，讓你仍然可以完整體驗流程。" />
      </div>

      <NeoCard className="space-y-4 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-neo border-4 border-ink bg-coral shadow-neo">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black">登入完成後，進度才會持久保存</h2>
            <p className="mt-1 text-sm leading-6 text-black/70">影片完成、最後兌換、已兌換狀態都會一起記錄。</p>
          </div>
        </div>
        <NeoButton type="button" size="lg" onClick={handleLogin} className="w-full">
          <LogIn className="h-5 w-5" />
          以匿名身份登入
        </NeoButton>
      </NeoCard>
    </div>
  );
}
