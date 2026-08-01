import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoInput } from "../components/ui/NeoInput";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithSchoolAccount, loading } = useGame();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const schoolDomain = "@hlhs.hlc.edu.tw";

  return (
    <PageContainer className="max-w-xl">
      <NeoCard>
        <h1 className="text-3xl font-black">學校帳號登入</h1>
        <p className="mt-3 text-sm">
          請使用你的學校帳號登入，電子郵件必須以 {schoolDomain} 結尾。登入後，系統會在 Firestore 建立你的闖關記錄。
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setFormError(null);
            try {
              await loginWithSchoolAccount(email, password);
              navigate("/checkpoints");
            } catch (error) {
              setFormError(error instanceof Error ? error.message : "登入失敗，請稍後再試。");
            }
          }}
        >
          <NeoInput
            label="學校帳號信箱"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={`yourname${schoolDomain}`}
            autoComplete="email"
            required
          />
          <NeoInput
            label="密碼"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          {formError && <p className="text-sm font-bold text-red-600">{formError}</p>}
          <NeoButton fullWidth disabled={loading} type="submit">
            {loading ? "登入中..." : "使用學校帳號登入"}
          </NeoButton>
        </form>
      </NeoCard>
    </PageContainer>
  );
}