import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAnonymously, loading } = useGame();

  return (
    <PageContainer className="max-w-xl">
      <NeoCard>
        <h1 className="text-3xl font-black">匿名登入</h1>
        <p className="mt-3 text-sm">
          你將以匿名方式參與，不需輸入帳號密碼。登入後，系統會在 Firestore 建立你的闖關記錄。
        </p>
        <div className="mt-6">
          <NeoButton
            fullWidth
            disabled={loading}
            onClick={async () => {
              await loginAnonymously();
              navigate("/checkpoints");
            }}
          >
            {loading ? "登入中..." : "以匿名身份登入"}
          </NeoButton>
        </div>
      </NeoCard>
    </PageContainer>
  );
}