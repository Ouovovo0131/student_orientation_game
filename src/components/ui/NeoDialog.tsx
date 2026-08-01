import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

type NeoDialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
};

export function NeoDialog({ open, title, children, onClose, footer }: NeoDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" role="presentation" onClick={onClose}>
      <NeoCard className="max-w-lg p-6" role="dialog" aria-modal="true" aria-labelledby="neo-dialog-title" onClick={(event) => event.stopPropagation()}>
        <div className={cn("space-y-5")}>
          <div className="flex items-start justify-between gap-4">
            <h2 id="neo-dialog-title" className="text-2xl font-black">
              {title}
            </h2>
            <NeoButton type="button" variant="ghost" size="sm" onClick={onClose} aria-label="關閉對話框">
              關閉
            </NeoButton>
          </div>
          <div>{children}</div>
          {footer ? <div>{footer}</div> : null}
        </div>
      </NeoCard>
    </div>
  );
}
