import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";

export function ChallengeFailedPage() {
  return (
    <PageContainer className="max-w-2xl">
      <NeoCard className="bg-[#FF6A6A]">
        <h1 className="text-4xl font-black">Challenge Failed</h1>
        <p className="mt-3">你尚未完成所有指定關卡，請回到列表繼續完成影片挑戰。</p>
        <Link to="/checkpoints" className="mt-6 inline-block">
          <NeoButton variant="secondary">回到關卡列表</NeoButton>
        </Link>
      </NeoCard>
    </PageContainer>
  );
}