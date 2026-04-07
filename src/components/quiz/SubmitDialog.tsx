import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { questions } from "@/data/questions";

interface SubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  savedCount: number;
  flaggedCount: number;
}

export function SubmitDialog({ open, onOpenChange, onConfirm, savedCount, flaggedCount }: SubmitDialogProps) {
  const unanswered = questions.length - savedCount;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading">Are you sure you want to submit?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">Please review your progress before submitting:</span>
            <span className="block">✅ Saved answers: <strong>{savedCount}</strong> / {questions.length}</span>
            {unanswered > 0 && (
              <span className="block text-destructive">⚠️ Unanswered: <strong>{unanswered}</strong></span>
            )}
            {flaggedCount > 0 && (
              <span className="block text-quiz-flagged">🚩 Flagged for review: <strong>{flaggedCount}</strong></span>
            )}
            <span className="block mt-2 font-medium">Once submitted, you cannot change your answers.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Yes, Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
