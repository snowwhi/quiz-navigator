import { useEffect, useState, useRef } from "react"; // Added useRef
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DotLottiePlayer } from '@dotlottie/react-player';
import success from "../assets/success.lottie"
import { questions } from "@/data/questions"
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

export default function Result() {
  const navigate = useNavigate();
  const [score, setScore] = useState({ correct: 0, total: 0, savedCount: 0 });
  const [user, setUser] = useState({ username: "", email: "" });
  const hasSentEmail = useRef(false);

  const sendEmail = (userData: any, scoreData: any) => {
    const templateParams = {
      to_email: userData.email,
      user_name: userData.username,
      score: `${scoreData.correct} / ${scoreData.total}`,
      percentage: `${Math.round((scoreData.correct / scoreData.total) * 100)}%`
    };

    // FIXED: Passed arguments as simple strings in the correct order
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => toast.success("Results sent to your email!"))
    .catch((err) => {
      console.error("EmailJS Error:", err);
      toast.error("Failed to send email.");
    });
  };

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

      let correctCount = 0;
      const savedAnswers = parsedQuiz.savedAnswers || {};
      for (const [idx, ans] of Object.entries(savedAnswers)) {
        if (questions[Number(idx)]?.correctAnswer === ans) correctCount++;
      }

      const finalScore = {
        correct: correctCount,
        total: questions.length,
        savedCount: Object.keys(savedAnswers).length,
      };

      setScore(finalScore);

      // FIXED: Trigger the email sending once the score is calculated
      if (!hasSentEmail.current && parsedUser.email) {
        sendEmail(parsedUser, finalScore);
        hasSentEmail.current = true;
      }

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