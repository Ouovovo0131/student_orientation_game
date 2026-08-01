import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import type { Checkpoint } from "@/types";

type CheckpointCardProps = {
  checkpoint: Checkpoint;
  completed: boolean;
  onOpen: () => void;
  onWatch: () => void;
};

const accentMap: Record<Checkpoint["accent"], string> = {
  acid: "bg-acid",
  coral: "bg-coral",
  sky: "bg-sky",
  violet: "bg-violet",
  gold: "bg-gold",
};

export function CheckpointCard({ checkpoint, completed, onOpen, onWatch }: CheckpointCardProps) {
  return (
    <NeoCard className="overflow-hidden">
      <div className={`h-3 ${accentMap[checkpoint.accent]}`} />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50">Checkpoint {checkpoint.order}</p>
            <h3 className="mt-1 text-2xl font-black">{checkpoint.title}</h3>
          </div>
          <NeoBadge variant={completed ? "success" : "warning"}>{completed ? "已完成" : "待完成"}</NeoBadge>
        </div>
        <p className="text-sm leading-6 text-black/75">{checkpoint.description}</p>
        <div className="flex flex-wrap gap-2">
          <NeoButton type="button" variant="ghost" size="sm" onClick={onOpen}>
            <Lock className="h-4 w-4" />
            查看詳情
          </NeoButton>
          <NeoButton type="button" variant="primary" size="sm" onClick={onWatch}>
            <PlayCircle className="h-4 w-4" />
            觀看影片
          </NeoButton>
          {completed ? (
            <NeoBadge variant="success" className="ml-auto">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              已入帳
            </NeoBadge>
          ) : null}
        </div>
      </div>
    </NeoCard>
  );
}
