import { PageContainer } from "../components/layout/PageContainer";
import { NeoCard } from "../components/ui/NeoCard";

export function LoadingPage() {
  return (
    <PageContainer className="max-w-xl">
      <NeoCard>
        <h1 className="text-2xl font-black">載入中</h1>
        <p className="mt-2">正在同步資料，請稍候。</p>
      </NeoCard>
    </PageContainer>
  );
}