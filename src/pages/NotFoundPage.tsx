import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";

export function NotFoundPage() {
  return (
    <PageContainer className="max-w-2xl">
      <NeoCard>
        <h1 className="text-5xl font-black">404</h1>
        <p className="mt-3">頁面不存在，請檢查網址是否正確。</p>
        <Link to="/" className="mt-6 inline-block">
          <NeoButton>回到首頁</NeoButton>
        </Link>
      </NeoCard>
    </PageContainer>
  );
}