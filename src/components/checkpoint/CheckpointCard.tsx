import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import type { Checkpoint } from "../../types";
import type { CheckpointAccessStatus } from "../../utils/checkpointAccess";
import { NeoBadge } from "../ui/NeoBadge";
import { NeoButton } from "../ui/NeoButton";
import { NeoCard } from "../ui/NeoCard";

interface CheckpointCardProps {
  checkpoint: Checkpoint;
  status: CheckpointAccessStatus;
  spotlightMode?: "locked" | "unlocked" | null;
}

export function CheckpointCard({ checkpoint, status, spotlightMode = null }: CheckpointCardProps) {
  const completed = status === "completed";
  const locked = status === "locked";

  const cardClassName = [
    "flex flex-col gap-4",
    locked ? "bg-[#EFEFEF]" : "",
    spotlightMode === "locked" ? "animate-stage-locked" : "",
    spotlightMode === "unlocked" ? "animate-stage-unlocked" : "",
  ].filter(Boolean).join(" ");

  const buttonLabel = completed ? "查看內容" : locked ? "尚未解鎖" : "開始闖關";
  const buttonVariant = completed ? "secondary" : locked ? "secondary" : "primary";

  return (
    <NeoCard className={cardClassName}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-black">{checkpoint.title}</h3>
        <NeoBadge tone={completed ? "success" : locked ? "info" : "warning"}>
          {completed ? "已完成" : locked ? "已鎖定" : "可挑戰"}
        </NeoBadge>
      </div>
      <p className="text-sm">{checkpoint.description}</p>

      {locked && (
        <div className="flex items-center gap-2 text-sm font-bold text-[#555]">
          <Lock size={16} />
          請先完成前一關才能進入此關卡。
        </div>
      )}

      {locked ? (
        <NeoButton variant={buttonVariant} fullWidth disabled>
          <Lock className="mr-1 inline" size={16} />
          {buttonLabel}
        </NeoButton>
      ) : (
        <Link to={`/checkpoints/${checkpoint.id}`} className="mt-1">
          <NeoButton variant={buttonVariant} fullWidth>
            {buttonLabel}
          </NeoButton>
        </Link>
      )}
    </NeoCard>
  );
}