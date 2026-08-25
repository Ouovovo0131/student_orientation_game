import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoBadge } from "../components/ui/NeoBadge";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useGame } from "../hooks/useGame";
import { getRedeemStats } from "../services/gameApi";
import type { RedeemStats } from "../types";

const EMPTY_STATS: RedeemStats = {
  totalPlayers: 0,
  eligiblePlayers: 0,
  ineligiblePlayers: 0,
  redeemedPlayers: 0,
  waitingRedeemPlayers: 0,
  requestedAccounts: [],
  classStats: [],
};

export function RedeemManagementPage() {
  const { uid, player, redeemControl, setRedeemControl, loading, totalCheckpoints } = useGame();
  const [stats, setStats] = useState<RedeemStats>(EMPTY_STATS);
  const [statsLoading, setStatsLoading] = useState(false);
  const isAdmin = player?.role === "admin";

  const refreshStats = async () => {
    if (!uid || !isAdmin) {
      return;
    }

    setStatsLoading(true);
    try {
      const next = await getRedeemStats(uid, totalCheckpoints);
      setStats(next);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    void refreshStats();
  }, [uid, isAdmin, totalCheckpoints]);

  if (!isAdmin) {
    return (
      <PageContainer className="max-w-2xl">
        <NeoCard className="bg-[#FFE48F]">
          <h1 className="text-3xl font-black">此頁僅限管理員</h1>
          <p className="mt-3 text-base">你目前不是管理員，請返回玩家兌換頁面。</p>
          <div className="mt-6">
            <Link to="/redeem">
              <NeoButton variant="secondary">前往玩家兌換頁</NeoButton>
            </Link>
          </div>
        </NeoCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-3xl">
      <NeoCard className="bg-[#E8F2FF]">
        <h1 className="text-3xl font-black">兌換管理頁面</h1>
        <p className="mt-2 text-sm">
          此頁會一直保留給管理員使用，和玩家兌換頁面不同。
          玩家使用 /redeem；管理員請使用 /admin/redeem。
        </p>
      </NeoCard>

      <NeoCard className="mt-4">
        <h2 className="text-2xl font-black">開啟兌換會有什麼效果？</h2>
        <div className="mt-3 space-y-2 text-sm">
          <p>1. 玩家在兌換頁面會看到可兌換判定與提示動畫。</p>
          <p>2. 玩家達標後可按「通知管理員：我可兌換」，帳號會進入下方名單。</p>
          <p>3. 關閉兌換後，玩家會顯示不可兌換狀態，無法送出通知。</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <NeoBadge tone={redeemControl.isOpen ? "success" : "warning"}>
            {redeemControl.isOpen ? "目前狀態：已開啟兌換" : "目前狀態：已關閉兌換"}
          </NeoBadge>
          <NeoButton
            variant={redeemControl.isOpen ? "danger" : "primary"}
            disabled={loading}
            onClick={async () => {
              await setRedeemControl({
                isOpen: !redeemControl.isOpen,
              });
            }}
          >
            {redeemControl.isOpen ? "立即關閉兌換" : "立即開啟兌換"}
          </NeoButton>
        </div>
      </NeoCard>

      <NeoCard className="mt-4 bg-[#F4FFF6]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">兌換統計</h2>
          <NeoButton variant="secondary" disabled={statsLoading} onClick={refreshStats}>
            {statsLoading ? "更新中..." : "重新整理統計"}
          </NeoButton>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <NeoBadge tone="info">玩家總數：{stats.totalPlayers}</NeoBadge>
          <NeoBadge tone="success">可兌獎人數：{stats.eligiblePlayers}</NeoBadge>
          <NeoBadge tone="warning">無法兌獎人數：{stats.ineligiblePlayers}</NeoBadge>
          <NeoBadge tone="info">已兌獎人數：{stats.redeemedPlayers}</NeoBadge>
          <NeoBadge tone="success">待兌獎人數：{stats.waitingRedeemPlayers}</NeoBadge>
        </div>
        <div className="mt-5 overflow-x-auto border-4 border-black bg-white">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-[#FFD644] font-black">
              <tr>
                <th className="border-b-2 border-black px-3 py-2">班級</th>
                <th className="border-b-2 border-black px-3 py-2">已登入</th>
                <th className="border-b-2 border-black px-3 py-2">可兌獎</th>
                <th className="border-b-2 border-black px-3 py-2">無法兌獎</th>
                <th className="border-b-2 border-black px-3 py-2">已兌獎</th>
                <th className="border-b-2 border-black px-3 py-2">待兌獎</th>
              </tr>
            </thead>
            <tbody>
              {stats.classStats.map((classStat) => (
                <tr key={classStat.classId} className="font-bold even:bg-[#FFF8E8]">
                  <th scope="row" className="border-b-2 border-black px-3 py-2 text-left">
                    {classStat.className}
                  </th>
                  <td className="border-b-2 border-black px-3 py-2">{classStat.totalPlayers}</td>
                  <td className="border-b-2 border-black px-3 py-2">{classStat.eligiblePlayers}</td>
                  <td className="border-b-2 border-black px-3 py-2">{classStat.ineligiblePlayers}</td>
                  <td className="border-b-2 border-black px-3 py-2">{classStat.redeemedPlayers}</td>
                  <td className="border-b-2 border-black px-3 py-2">{classStat.waitingRedeemPlayers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 border-4 border-black bg-white p-4">
          <h3 className="text-lg font-black">已送出可兌換通知的帳號</h3>
          {stats.requestedAccounts.length === 0 ? (
            <p className="mt-2 text-sm">目前尚無玩家送出可兌換通知。</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm font-bold">
              {stats.requestedAccounts.map((account) => (
                <li key={account} className="border-2 border-black bg-[#FFF8E8] px-3 py-2">
                  {account}
                </li>
              ))}
            </ul>
          )}
        </div>
      </NeoCard>
    </PageContainer>
  );
}
