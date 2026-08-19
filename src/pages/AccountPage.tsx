import { ArrowLeft, LogOut, Settings, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";

function buildAvatarFallback(nameOrEmail: string): string {
  const trimmed = nameOrEmail.trim();
  if (!trimmed) {
    return "玩家";
  }

  const source = trimmed.includes("@") ? trimmed.split("@")[0] : trimmed;
  return source.slice(0, 2).toUpperCase();
}

export function AccountPage() {
  const navigate = useNavigate();
  const { userProfile, player, logout, loading } = useGame();
  const isAdmin = player?.role === "admin";

  const displayName = userProfile?.displayName || userProfile?.email || "未命名玩家";
  const email = userProfile?.email || "未取得信箱";
  const accountName = email.includes("@") ? email.split("@")[0] : email;

  return (
    <PageContainer className="max-w-2xl">
      <NeoButton
        type="button"
        variant="secondary"
        className="mb-4 px-4 py-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-1 inline" size={18} />
        返回上一頁
      </NeoButton>

      <NeoCard className="bg-[#E8F2FF]">
        <h1 className="text-3xl font-black">玩家帳號</h1>
        <p className="mt-2 text-sm">你可以在這裡查看目前登入資料與玩家 UID。</p>
      </NeoCard>

      <NeoCard className="mt-4">
        <div className="flex items-center gap-4">
          {userProfile?.photoURL ? (
            <img
              src={userProfile.photoURL}
              alt="玩家頭像"
              className="h-20 w-20 rounded-none border-4 border-black object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center border-4 border-black bg-[#FFD644] text-xl font-black">
              {buildAvatarFallback(displayName)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 text-xl font-black">
              <UserRound size={18} />
              {accountName || displayName}
            </div>
            <p className="mt-1 text-sm font-bold">{email}</p>
            {displayName && displayName !== accountName && (
              <p className="mt-1 text-xs font-bold text-[#444]">顯示名稱：{displayName}</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="border-4 border-black bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.2em]">玩家 UID（純數字）</p>
            <p className="mt-1 text-2xl font-black">{player?.playerUid ?? "尚未配發"}</p>
          </div>
        </div>

        <NeoButton
          variant="danger"
          className="mt-6"
          disabled={loading}
          onClick={async () => {
            await logout();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut className="mr-1 inline" size={16} />
          登出
        </NeoButton>
      </NeoCard>

      {isAdmin && (
        <NeoCard className="mt-4 bg-[#FFF8E8]">
          <div className="flex items-center gap-2">
            <Settings size={22} />
            <h2 className="text-2xl font-black">管理員功能</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link to="/admin/checkpoints">
              <NeoButton variant="secondary" fullWidth>
                關卡管理
              </NeoButton>
            </Link>
            <Link to="/admin/redeem">
              <NeoButton fullWidth>
                兌換管理
              </NeoButton>
            </Link>
          </div>
        </NeoCard>
      )}
    </PageContainer>
  );
}
