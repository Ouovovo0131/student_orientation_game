import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { useGame } from "@/hooks/useGame";

export function CompletionAnimationPage() {
  const { checkpointId } = useParams();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { checkpoints, isComplete } = useGame();
  const checkpoint = checkpoints.find((item) => item.id === checkpointId);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(isComplete ? "/result" : "/checkpoints");
    }, reduceMotion ? 0 : 1800);

    return () => window.clearTimeout(timer);
  }, [isComplete, navigate, reduceMotion]);

  if (!checkpoint) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={reduceMotion ? false : { scale: 0.92, rotate: -2, opacity: 0 }}
        animate={reduceMotion ? {} : { scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="w-full max-w-xl"
      >
        <NeoCard className="space-y-6 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-ink bg-acid shadow-neo">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black">Checkpoint 完成！</h1>
            <p className="text-black/75">已經成功登記「{checkpoint.title}」的完成狀態，正在前往下一步。</p>
          </div>
          <NeoButton type="button" onClick={() => navigate(isComplete ? "/result" : "/checkpoints")}>
            <LoaderCircle className="h-4 w-4" />
            立即前往
          </NeoButton>
        </NeoCard>
      </motion.div>
    </div>
  );
}
