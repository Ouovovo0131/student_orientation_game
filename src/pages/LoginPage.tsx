import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithSchoolAccount, loading, player, uid } = useGame();
  const destination = typeof location.state?.from === "string" ? location.state.from : "/checkpoints";

  const schoolDomain = "@hlhs.hlc.edu.tw";
  const testAccount = "cheiling0131@gmail.com";

  useEffect(() => {
    if (uid && player) {
      navigate(destination, { replace: true });
    }
  }, [destination, uid, player, navigate]);

  return (
    <PageContainer className="max-w-xl">
      <NeoCard>
        <h1 className="text-3xl font-black">Google 學校帳號登入</h1>
        <p className="mt-3 text-sm">
          請使用你的學校 Google 帳號登入，電子郵件是以 {schoolDomain} 結尾。
        </p>
        <div className="mt-6 space-y-4">
          <p className="rounded-2xl border-4 border-black bg-[#FFF8E8] p-4 text-sm font-bold shadow-[4px_4px_0_0_#000]">
            點擊登入後會顯示 Google 帳號選擇器，請選擇學校帳號進行遊玩。
          </p>
          <NeoButton
            fullWidth
            disabled={loading}
            type="button"
            onClick={async () => {
              try {
                await loginWithSchoolAccount();
              } catch {
                // GameContext 會把錯誤寫進全域狀態，這裡只需保留流程。
              }
            }}
          >
            {loading ? "登入中..." : "使用學校 Google 帳號登入"}
          </NeoButton>
        </div>
      </NeoCard>
    </PageContainer>
  );
}