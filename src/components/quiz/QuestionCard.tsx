import { questions } from "@/data/questions";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Flag, Save, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface QuestionCardProps {
  currentIndex: number;
  selectedAnswer: number | undefined;
  isSaved: boolean;
  isFlagged: boolean;
  onSelectAnswer: (questionIndex: number, optionIndex: number) => void;
  onSaveAndNext: () => void;
  onSave: () => void;
  onToggleFlag: (index: number) => void;
}

export function QuestionCard({
  currentIndex,
  selectedAnswer,
  isSaved,
  isFlagged,
  onSelectAnswer,
  onSaveAndNext,
  onSave,
  onToggleFlag,
}: QuestionCardProps) {
  const [loading, setLoading] = useState(false);
  const question = questions[currentIndex];

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-full" />
        <div className="space-y-3 pt-4">
          {[0, 1, 2, 3].map(i => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleFlag(currentIndex)}
          className={isFlagged ? "text-quiz-flagged" : "text-muted-foreground"}
        >
          <Flag className="h-4 w-4 mr-1" fill={isFlagged ? "currentColor" : "none"} />
          {isFlagged ? "Flagged" : "Flag"}
        </Button>
      </div>

      <h2 className="text-xl font-heading font-semibold">{question.text}</h2>

      <RadioGroup
        value={selectedAnswer !== undefined ? String(selectedAnswer) : ""}
        onValueChange={(val) => onSelectAnswer(currentIndex, Number(val))}
        className="space-y-3"
      >
        {question.options.map((option, i) => (
          <Label
            key={i}
            htmlFor={`opt-${i}`}
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:border-primary/50 ${
              selectedAnswer === i
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            } ${isSaved && selectedAnswer === i ? "border-quiz-saved bg-quiz-saved/10" : ""}`}
          >
            <RadioGroupItem value={String(i)} id={`opt-${i}`} />
            <span className="text-sm font-medium">{option}</span>
          </Label>
        ))}
      </RadioGroup>

      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={selectedAnswer === undefined || isSaved}
        >
          <Save className="h-4 w-4 mr-1" />
          {isSaved ? "Saved" : "Save"}
        </Button>
        <Button
          size="sm"
          onClick={onSaveAndNext}
          disabled={selectedAnswer === undefined || currentIndex === questions.length - 1}
        >
          Save & Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
