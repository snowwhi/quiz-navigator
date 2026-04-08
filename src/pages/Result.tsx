import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { DotLottiePlayer } from '@dotlottie/react-player';
import success from "../assets/success.lottie"
import { questions } from "@/data/questions";
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
  }, [navigate]);

  const percentage = Math.round((score.correct / score.total) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg text-center animate-fade-in space-y-6 bg-blue-400">
        <div className="w-lg h-48 mx-auto bg-red-500 ">
        <DotLottiePlayer
    src={success}
    autoplay
    loop={true}
  />
        </div>

        <div className="space-y-2 bg-amber-400">
          <h1 className="text-3xl font-heading font-bold">
            Thanks for submitting, {user.username}! 🎉
          </h1>
          <p className="text-foreground">
            Your quiz has been completed successfully
          </p>
        </div>

        <p className="text-sm text-foreground">
          📧 Results will be sent to <span className="font-medium text-foreground">{user.email}</span>
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem("quiz_progress");
              sessionStorage.removeItem("quiz_user");
              navigate("/login", { replace: true });
            }}
          >
            Logout
          </Button>
          <Button
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
