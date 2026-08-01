import { AnimatePresence, motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { NeoButton } from "./NeoButton";

interface NeoDialogProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
}

export function NeoDialog({ open, title, onClose, children }: NeoDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ y: 20, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 12, scale: 0.95 }}
            className="w-full max-w-md border-4 border-black bg-cream p-5 shadow-[10px_10px_0_0_#000]"
          >
            <h2 className="text-xl font-extrabold">{title}</h2>
            <div className="mt-3 text-sm">{children}</div>
            <div className="mt-5">
              <NeoButton variant="secondary" onClick={onClose} fullWidth>
                關閉
              </NeoButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}