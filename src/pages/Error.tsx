import { useNavigate } from "react-router-dom";
import { AlertCircle, RotateCw } from "lucide-react";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { useGame } from "@/hooks/useGame";

export function ErrorPage() {
  const navigate = useNavigate();
  const { error, signIn } = useGame();

  async function handleRetry() {
    await signIn();
    navigate("/checkpoints");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <NeoCard className="space-y-4 p-7 text-center">
        <AlertCircle className="mx-auto h-10 w-10" />
        <h1 className="text-3xl font-black">發生錯誤</h1>
        <p className="text-sm leading-6 text-black/70">{error ?? "請重新整理或再試一次。"}</p>
        <NeoButton type="button" onClick={() => void handleRetry()}>
          <RotateCw className="h-4 w-4" />
          重試
        </NeoButton>
      </NeoCard>
    </div>
  );
}
