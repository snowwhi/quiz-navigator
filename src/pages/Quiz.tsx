import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizState } from "@/hooks/useQuizState";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionNavigator } from "@/components/quiz/QuestionNavigator";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { SubmitDialog } from "@/components/quiz/SubmitDialog";
import { toast } from "sonner";

export default function Quiz() {
  const navigate = useNavigate();
  const quiz = useQuizState();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const prevIndexRef = useRef(quiz.currentIndex);

  // Check login
  useEffect(() => {
    const user = sessionStorage.getItem("quiz_user");
    if (!user) navigate("/login", { replace: true });
  }, [navigate]);

  // Navigate to result when submitted
  useEffect(() => {
    if (quiz.isSubmitted) {
      navigate("/result", { replace: true });
    }
  }, [quiz.isSubmitted, navigate]);

  // Toast when moving without saving
  useEffect(() => {
    if (prevIndexRef.current !== quiz.currentIndex) {
      const prevIdx = prevIndexRef.current;
      const hadSelection = quiz.selectedAnswers[prevIdx] !== undefined;
      const wasSaved = quiz.savedAnswers[prevIdx] !== undefined;
      if (hadSelection && !wasSaved) {
        toast.warning("Previous question was not saved!", {
          description: `Question ${prevIdx + 1} has an unsaved selection.`,
        });
      }
      prevIndexRef.current = quiz.currentIndex;
    }
  }, [quiz.currentIndex, quiz.selectedAnswers, quiz.savedAnswers]);

  // Init theme
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") document.documentElement.classList.add("dark");
    const accent = localStorage.getItem("accent-color");
    if (accent) document.documentElement.style.setProperty("--accent-color", accent);
  }, []);

  const user = JSON.parse(sessionStorage.getItem("quiz_user") || '{"username":"User","email":""}');
  const { correct, total, savedCount } = quiz.getScore();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <QuizHeader
        timeRemaining={quiz.timeRemaining}
        username={user.username}
        onSaveProgress={() => {
          quiz.saveProgress();
          toast.success("Progress saved!");
        }}
        onSubmit={() => setShowSubmitDialog(true)}
      />

      <div className="flex-1 flex">
        {/* Question Area */}
        <div className="flex-1 max-w-3xl mx-auto w-full">
          <QuestionCard
            currentIndex={quiz.currentIndex}
            selectedAnswer={quiz.selectedAnswers[quiz.currentIndex]}
            isSaved={quiz.savedAnswers[quiz.currentIndex] !== undefined}
            isFlagged={quiz.flaggedQuestions.includes(quiz.currentIndex)}
            onSelectAnswer={quiz.selectAnswer}
            onSaveAndNext={quiz.saveAndNext}
            onSave={quiz.saveAnswer}
            onToggleFlag={quiz.toggleFlag}
          />
        </div>

        {/* Navigator Sidebar */}
        <aside className="w-64 border-l border-border p-4 hidden md:block bg-card/50">
          <QuestionNavigator
            currentIndex={quiz.currentIndex}
            savedAnswers={quiz.savedAnswers}
            flaggedQuestions={quiz.flaggedQuestions}
            onGoToQuestion={quiz.goToQuestion}
          />
        </aside>
      </div>

      <SubmitDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        onConfirm={quiz.submit}
        savedCount={savedCount}
        flaggedCount={quiz.flaggedQuestions.length}
      />
    </div>
  );
}
