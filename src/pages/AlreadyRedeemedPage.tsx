import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";

export function AlreadyRedeemedPage() {
  return (
    <PageContainer className="max-w-2xl">
      <NeoCard className="bg-[#8DD8FF]">
        <h1 className="text-4xl font-black">Already Redeemed</h1>
        <p className="mt-3">你的帳號已完成獎勵兌換，系統不允許重複兌換。</p>
        <Link to="/result" className="mt-6 inline-block">
          <NeoButton variant="secondary">返回結果頁</NeoButton>
        </Link>
      </NeoCard>
    </PageContainer>
  );
}