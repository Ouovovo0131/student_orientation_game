import { Link } from "react-router-dom";
import type { Checkpoint } from "../../types";
import { NeoBadge } from "../ui/NeoBadge";
import { NeoButton } from "../ui/NeoButton";
import { NeoCard } from "../ui/NeoCard";

interface CheckpointCardProps {
  checkpoint: Checkpoint;
  completed: boolean;
}

export function CheckpointCard({ checkpoint, completed }: CheckpointCardProps) {
  return (
    <NeoCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-black">{checkpoint.title}</h3>
        <NeoBadge tone={completed ? "success" : "warning"}>
          {completed ? "已完成" : "未完成"}
        </NeoBadge>
      </div>
      <p className="text-sm">{checkpoint.description}</p>
      <Link to={`/checkpoints/${checkpoint.id}`} className="mt-1">
        <NeoButton variant={completed ? "secondary" : "primary"} fullWidth>
          {completed ? "查看內容" : "開始闖關"}
        </NeoButton>
      </Link>
    </NeoCard>
  );
}