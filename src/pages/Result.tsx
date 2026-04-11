import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DotLottiePlayer } from '@dotlottie/react-player';
import success from "../assets/success.lottie"
import { questions } from "@/data/questions";
import { toast } from "sonner";

export default function Result() {
  const navigate = useNavigate();
  const [score, setScore] = useState({ correct: 0, total: 0, savedCount: 0 });
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    const userData = sessionStorage.getItem("quiz_user");
    const quizData = sessionStorage.getItem("quiz_progress");
    
    if (!userData || !quizData) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      const parsedQuiz = JSON.parse(quizData);
      setUser(parsedUser);

      let correct = 0;
      const savedAnswers = parsedQuiz.savedAnswers || {};
      for (const [idx, ans] of Object.entries(savedAnswers)) {
        if (questions[Number(idx)]?.correctAnswer === ans) correct++;
      }
      setScore({
        correct,
        total: questions.length,
        savedCount: Object.keys(savedAnswers).length,
      });
    } catch (e) {
      toast.error("Error loading results");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg text-center animate-fade-in space-y-8 p-6 rounded-xl border border-border shadow-sm">
        <div className="w-full h-48 flex justify-center items-center overflow-hidden">
          <DotLottiePlayer
            src={success}
            autoplay
            loop={true}
            style={{ height: '100%', width: 'auto' }}
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-heading font-bold tracking-tight">
            Great job, {user.username}! 🎉
          </h1>
          <div className="space-y-1">
             <p className="text-lg font-medium text-muted-foreground">
               Your Score: {score.correct} / {score.total}
             </p>
             <p className="text-sm text-muted-foreground">
               Your results have been saved successfully
             </p>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">
            📧 Confirmation sent to: <br/>
            <span className="font-semibold text-primary">{user.email}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto px-8"
            onClick={() => {
              sessionStorage.removeItem("quiz_progress");
              sessionStorage.removeItem("quiz_user");
              navigate("/login", { replace: true });
            }}
          >
            Logout
          </Button>
          <Button
            className="w-full sm:w-auto px-8"
            onClick={() => {
              sessionStorage.removeItem("quiz_progress");
              navigate("/quiz", { replace: true });
            }}
          >
            Retake Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}