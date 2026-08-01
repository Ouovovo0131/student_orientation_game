import { Outlet, useLocation } from "react-router-dom";
import { BottomActionBar } from "@/components/layout/BottomActionBar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { PageContainer } from "@/components/layout/PageContainer";

export function AppShell() {
  const { pathname } = useLocation();
  const minimal = ["/loading", "/error", "/404"].includes(pathname);

  if (minimal) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen">
      <TopNavigation />
      <PageContainer className="pb-28 pt-8">
        <Outlet />
      </PageContainer>
      <BottomActionBar />
    </div>
  );
}
