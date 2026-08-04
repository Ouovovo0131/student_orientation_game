import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useCheckpoint } from "../hooks/useCheckpoint";
import { useGame } from "../hooks/useGame";

export function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const checkpoint = useCheckpoint(id);
  const { completeCheckpoint, player } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<"idle" | "wrong" | "correct">("idle");
  const [submitting, setSubmitting] = useState(false);

  if (!checkpoint) {
    return (
      <PageContainer>
        <p className="border-4 border-black bg-[#FF6A6A] p-5 text-lg font-black">錯誤：無效的問答頁面。</p>
      </PageContainer>
    );
  }

  const completed = Boolean(player?.completedStages[checkpoint.id]);
  const quiz = checkpoint.quiz;
  const quizOptions = useMemo(() => quiz?.options ?? [], [quiz]);

  const handleAnswer = async (index: number) => {
    if (!quiz || submitting || completed || quizState === "correct") {
      return;
    }

    setSelectedAnswer(index);
    if (index !== quiz.answerIndex) {
      setQuizState("wrong");
      return;
    }

    setQuizState("correct");
    setSubmitting(true);
    try {
      await completeCheckpoint(checkpoint.id);
      window.setTimeout(() => {
        navigate(`/completion?stage=${checkpoint.id}`);
      }, 900);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer className="max-w-3xl">
      <NeoButton
        type="button"
        variant="secondary"
        className="mb-4 px-4 py-2"
        onClick={() => navigate(`/video/${checkpoint.id}`)}
      >
        <ArrowLeft className="mr-1 inline" size={18} />
        返回影片
      </NeoButton>

      <NeoCard className="bg-[#FFF8E8]">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#A33A00]">快問快答</p>
        <h2 className="mt-2 text-2xl font-black">{checkpoint.title}</h2>
        <p className="mt-3 text-sm font-bold">{quiz?.prompt ?? "這個關卡沒有快問快答題目。"}</p>

        {quiz && (
          <div className="mt-6 grid gap-3">
            {quizOptions.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const buttonTone = quizState === "correct" && index === quiz.answerIndex
                ? "bg-[#3BEA7D]"
                : quizState === "wrong" && isSelected
                  ? "bg-[#FF6A6A]"
                  : "bg-white";

              return (
                <NeoButton
                  key={option}
                  type="button"
                  variant="secondary"
                  className={`justify-start text-left ${buttonTone}`}
                  disabled={submitting || quizState === "correct"}
                  onClick={() => void handleAnswer(index)}
                >
                  {option}
                </NeoButton>
              );
            })}
          </div>
        )}

        {quizState === "wrong" && (
          <p className="mt-4 text-sm font-bold text-[#A33A00]">答錯了，請再試一次。</p>
        )}

        {quizState === "correct" && (
          <div className="mt-4 rounded-none border-4 border-black bg-[#3BEA7D] p-4 text-center text-lg font-black">
            🎉 答對了！關卡已完成，正在前往完成頁面…
          </div>
        )}
      </NeoCard>
    </PageContainer>
  );
}
