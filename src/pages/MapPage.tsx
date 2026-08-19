import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { SectionTitle } from "../components/ui/SectionTitle";

export function MapPage() {
  const navigate = useNavigate();

  return (
    <PageContainer className="max-w-5xl">
      <NeoButton
        type="button"
        variant="secondary"
        className="mb-4 px-4 py-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-1 inline" size={18} />
        返回上一頁
      </NeoButton>
      <NeoCard>
        <SectionTitle>校園地圖</SectionTitle>
        <div className="mt-4 overflow-auto border-4 border-black bg-white p-2">
          <img
            src="/campus-map.png"
            alt="校園地圖"
            className="mx-auto h-auto w-full min-w-[640px] object-contain"
          />
        </div>
      </NeoCard>
    </PageContainer>
  );
}