import { motion, useReducedMotion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { BottomActionBar } from "../components/layout/BottomActionBar";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";

export function CompletionAnimationPage() {
  const [search] = useSearchParams();
  const stage = search.get("stage") ?? "關卡";
  const reduceMotion = useReducedMotion();

  return (
    <>
      <PageContainer className="max-w-2xl">
        <NeoCard className="bg-[#3BEA7D] text-center">
          <motion.div
            initial={reduceMotion ? false : { rotate: -5, scale: 0.8 }}
            animate={reduceMotion ? {} : { rotate: [0, -4, 4, 0], scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block border-4 border-black bg-white px-4 py-2 text-2xl font-black"
          >
            +1 POINT
          </motion.div>
          <h1 className="mt-4 text-3xl font-black">完成 {stage}</h1>
          <p className="mt-2">恭喜！你的闖關分數已經同步到資料庫。</p>
        </NeoCard>
      </PageContainer>
      <BottomActionBar>
        <Link to="/checkpoints">
          <NeoButton fullWidth>繼續其他關卡</NeoButton>
        </Link>
      </BottomActionBar>
    </>
  );
}