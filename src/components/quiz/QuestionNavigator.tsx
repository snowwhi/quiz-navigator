import { questions } from "@/data/questions";

interface QuestionNavigatorProps {
  currentIndex: number;
  savedAnswers: Record<number, number>;
  flaggedQuestions: number[];
  onGoToQuestion: (index: number) => void;
}

export function QuestionNavigator({
  currentIndex,
  savedAnswers,
  flaggedQuestions,
  onGoToQuestion,
}: QuestionNavigatorProps) {
  const getStatus = (index: number) => {
    if (index === currentIndex) return "current";
    if (flaggedQuestions.includes(index) && savedAnswers[index] !== undefined) return "saved-flagged";
    if (flaggedQuestions.includes(index)) return "flagged";
    if (savedAnswers[index] !== undefined) return "saved";
    return "unanswered";
  };

  const statusClasses: Record<string, string> = {
    current: "bg-primary text-primary-foreground border-primary shadow-md",
    saved: "bg-quiz-saved text-quiz-saved-foreground border-quiz-saved",
    flagged: "bg-quiz-flagged text-quiz-flagged-foreground border-quiz-flagged",
    "saved-flagged": "bg-quiz-saved text-quiz-saved-foreground border-quiz-flagged border-2",
    unanswered: "bg-quiz-unanswered text-quiz-unanswered-foreground border-border hover:border-primary/40",
  };

  const savedCount = Object.keys(savedAnswers).length;
  const flaggedCount = flaggedQuestions.length;

  return (
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-sm">Question Navigator</h3>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => onGoToQuestion(i)}
            className={`quiz-grid-btn ${statusClasses[getStatus(i)]}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="space-y-2 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground font-medium">Legend</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary" /> Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-quiz-saved" /> Saved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-quiz-flagged" /> Flagged
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-quiz-unanswered border border-border" /> Unanswered
          </span>
        </div>
      </div>

      <div className="space-y-1 pt-2 text-xs text-muted-foreground">
        <p>Saved: <span className="font-semibold text-foreground">{savedCount}</span> / {questions.length}</p>
        <p>Flagged: <span className="font-semibold text-foreground">{flaggedCount}</span></p>
      </div>
    </div>
  );
}
