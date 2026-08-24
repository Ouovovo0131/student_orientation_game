import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { NeoButton } from "../components/ui/NeoButton";
import { NeoCard } from "../components/ui/NeoCard";
import { useCheckpoint } from "../hooks/useCheckpoint";
import { useGame } from "../hooks/useGame";
import { getStageAccessStatus } from "../utils/checkpointAccess";

export function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const checkpoint = useCheckpoint(id);
  const { completeCheckpoint, verifyStagePasscode, player } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<"idle" | "wrong" | "correct">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  if (!checkpoint) {
    return (
      <PageContainer>
        <p className="border-4 border-black bg-[#FF6A6A] p-5 text-lg font-black">錯誤：無效的問答頁面。</p>
      </PageContainer>
    );
  }

  const completed = Boolean(player?.completedStages[checkpoint.id]);
  const stageStatus = getStageAccessStatus(checkpoint.id, player?.unlockedStages, player?.completedStages);
  const quiz = checkpoint.quiz;
  const staffPasscode = checkpoint.staffPasscode;
  const quizOptions = useMemo(() => quiz?.options ?? [], [quiz]);

  if (stageStatus === "locked") {
    return <Navigate to={`/checkpoints?focus=${checkpoint.id}&mode=locked`} replace />;
  }

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

  const handlePasscodeSubmit = async () => {
    if (!staffPasscode || submitting || completed) {
      return;
    }

    setPasscodeError(null);
    setSubmitting(true);
    try {
      await verifyStagePasscode(checkpoint.id, passcodeInput.trim());
      navigate(`/completion?stage=${checkpoint.id}`);
    } catch (error) {
      setPasscodeError(error instanceof Error ? error.message : "密碼驗證失敗，請稍後再試。");
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
        {staffPasscode ? (
          <>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#A33A00]">現場問答</p>
            <h2 className="mt-2 text-2xl font-black">{checkpoint.title}</h2>
            <p className="mt-3 text-sm font-bold">{staffPasscode.instruction}</p>

            <div className="mt-6 grid gap-3">
              <NeoInput
                label="通關密碼"
                inputMode="numeric"
                maxLength={6}
                placeholder="請輸入 6 位數通關密碼"
                value={passcodeInput}
                onChange={(event) => setPasscodeInput(event.target.value)}
                disabled={submitting || completed}
              />
              <NeoButton
                type="button"
                disabled={submitting || completed || passcodeInput.trim().length !== 6}
                onClick={() => void handlePasscodeSubmit()}
              >
                {submitting ? "驗證中..." : "送出密碼"}
              </NeoButton>
            </div>

            {passcodeError && (
              <p className="mt-4 text-sm font-bold text-[#A33A00]">{passcodeError}</p>
            )}

            {completed && (
              <div className="mt-4 rounded-none border-4 border-black bg-[#3BEA7D] p-4 text-center text-lg font-black">
                🎉 密碼正確！關卡已完成。
              </div>
            )}
          </>
        ) : (
          <>
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
          </>
        )}
      </NeoCard>
    </PageContainer>
  );
}

