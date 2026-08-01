import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";

interface ErrorPageProps {
  message?: string;
}

export function ErrorPage({ message }: ErrorPageProps) {
  return (
    <PageContainer className="max-w-2xl">
      <NeoCard className="bg-[#FF6A6A]">
        <h1 className="text-3xl font-black">系統錯誤</h1>
        <p className="mt-3 text-base">{message ?? "發生非預期問題，請稍後再試。"}</p>
        <Link to="/" className="mt-6 inline-block">
          <NeoButton variant="secondary">回首頁</NeoButton>
        </Link>
      </NeoCard>
    </PageContainer>
  );
}