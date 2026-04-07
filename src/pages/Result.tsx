import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { questions } from "@/data/questions";

const successAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Success",
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Check",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0] }, { t: 15, s: [100] }] },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 10, s: [0, 0, 100] },
            { t: 25, s: [110, 110, 100] },
            { t: 35, s: [100, 100, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [120, 120] },
              p: { a: 0, k: [0, 0] },
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.35, 0.78, 0.35, 1] },
              o: { a: 0, k: 100 },
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              d: 1,
              ks: {
                a: 0,
                k: {
                  c: false,
                  v: [[-25, 5], [-10, 20], [25, -15]],
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                },
              },
            },
            {
              ty: "st",
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 6 },
              lc: 2,
              lj: 2,
            },
            {
              ty: "tm",
              s: { a: 0, k: 0 },
              e: {
                a: 1,
                k: [{ t: 15, s: [0] }, { t: 35, s: [100] }],
              },
              o: { a: 0, k: 0 },
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
    },
  ],
};

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
      <div className="w-full max-w-lg text-center animate-fade-in space-y-6">
        <div className="w-48 h-48 mx-auto">
          <Lottie animationData={successAnimation} loop={false} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold">
            Thanks for submitting, {user.username}! 🎉
          </h1>
          <p className="text-muted-foreground">
            Your quiz has been completed successfully
          </p>
        </div>

        <Card className="text-left">
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Score</span>
              <span className="font-bold">{score.correct} / {score.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Percentage</span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Questions Answered</span>
              <span className="font-bold">{score.savedCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Skipped</span>
              <span className="font-bold">{score.total - score.savedCount}</span>
            </div>

            {/* Progress bar */}
            <div className="pt-2">
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
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
