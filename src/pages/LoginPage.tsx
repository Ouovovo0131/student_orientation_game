import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithSchoolAccount, loading, uid } = useGame();

  const schoolDomain = "@hlhs.hlc.edu.tw";

  useEffect(() => {
    if (uid) {
      navigate("/checkpoints", { replace: true });
    }
  }, [uid, navigate]);

  return (
    <PageContainer className="max-w-xl">
      <NeoCard>
        <h1 className="text-3xl font-black">Google 學校帳號登入</h1>
        <p className="mt-3 text-sm">
          請使用你的學校 Google 帳號登入，電子郵件必須以 {schoolDomain} 結尾。登入後，系統會在 Firestore 建立你的闖關記錄。
        </p>
        <div className="mt-6 space-y-4">
          <p className="rounded-2xl border-4 border-black bg-[#FFF8E8] p-4 text-sm font-bold shadow-[4px_4px_0_0_#000]">
            系統只接受學校 Google 帳號，登入後會自動檢查是否為 {schoolDomain}。
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