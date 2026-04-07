import { useState, useEffect, useCallback, useRef } from "react";
import { questions } from "@/data/questions";

export interface QuizState {
  currentIndex: number;
  selectedAnswers: Record<number, number>;
  savedAnswers: Record<number, number>;
  flaggedQuestions: number[];
  timeRemaining: number;
  isSubmitted: boolean;
}

const TOTAL_TIME = 60 * 60; // 1 hour in seconds
const STORAGE_KEY = "quiz_progress";

function loadState(): QuizState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(state: QuizState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useQuizState() {
  const [state, setState] = useState<QuizState>(() => {
    const saved = loadState();
    return saved || {
      currentIndex: 0,
      selectedAnswers: {},
      savedAnswers: {},
      flaggedQuestions: [],
      timeRemaining: TOTAL_TIME,
      isSubmitted: false,
    };
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (state.isSubmitted) return;
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timerRef.current!);
          return { ...prev, timeRemaining: 0, isSubmitted: true };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.isSubmitted]);

  // Auto-save to session storage
  useEffect(() => { saveState(state); }, [state]);

  const selectAnswer = useCallback((questionIndex: number, optionIndex: number) => {
    setState(prev => ({
      ...prev,
      selectedAnswers: { ...prev.selectedAnswers, [questionIndex]: optionIndex },
    }));
  }, []);

  const saveAnswer = useCallback(() => {
    setState(prev => {
      const selected = prev.selectedAnswers[prev.currentIndex];
      if (selected === undefined) return prev;
      return {
        ...prev,
        savedAnswers: { ...prev.savedAnswers, [prev.currentIndex]: selected },
      };
    });
  }, []);

  const saveAndNext = useCallback(() => {
    setState(prev => {
      const selected = prev.selectedAnswers[prev.currentIndex];
      if (selected === undefined) return prev;
      const newSaved = { ...prev.savedAnswers, [prev.currentIndex]: selected };
      const nextIndex = Math.min(prev.currentIndex + 1, questions.length - 1);
      return { ...prev, savedAnswers: newSaved, currentIndex: nextIndex };
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setState(prev => ({ ...prev, currentIndex: index }));
  }, []);

  const toggleFlag = useCallback((index: number) => {
    setState(prev => {
      const flagged = prev.flaggedQuestions.includes(index)
        ? prev.flaggedQuestions.filter(i => i !== index)
        : [...prev.flaggedQuestions, index];
      return { ...prev, flaggedQuestions: flagged };
    });
  }, []);

  const submit = useCallback(() => {
    setState(prev => ({ ...prev, isSubmitted: true }));
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const isCurrentSaved = state.savedAnswers[state.currentIndex] !== undefined;
  const hasUnsavedSelection = state.selectedAnswers[state.currentIndex] !== undefined && !isCurrentSaved;

  const getScore = useCallback(() => {
    let correct = 0;
    for (const [idx, ans] of Object.entries(state.savedAnswers)) {
      if (questions[Number(idx)]?.correctAnswer === ans) correct++;
    }
    return { correct, total: questions.length, savedCount: Object.keys(state.savedAnswers).length };
  }, [state.savedAnswers]);

  const resetQuiz = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState({
      currentIndex: 0,
      selectedAnswers: {},
      savedAnswers: {},
      flaggedQuestions: [],
      timeRemaining: TOTAL_TIME,
      isSubmitted: false,
    });
  }, []);

  return {
    ...state,
    selectAnswer,
    saveAnswer,
    saveAndNext,
    goToQuestion,
    toggleFlag,
    submit,
    isCurrentSaved,
    hasUnsavedSelection,
    getScore,
    resetQuiz,
    saveProgress: () => saveState(state),
  };
}
