"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

export interface TestContextType {
  currentTime: number;
  currentQuestionIndex: number;
  currentQuestionId: number | null;
  setCurrentQuestionId: (id: number | null) => void;
  totalQuestions: number;
  answers: Record<number, any>;
  setAnswer: (questionId: number, answer: any) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({
  children,
  durationSeconds,
  totalQuestions,
  hasTimer = false,
}: {
  children: ReactNode;
  durationSeconds: number;
  totalQuestions: number;
  hasTimer?: boolean;
}) {
  const [currentTime, setCurrentTime] = useState(durationSeconds);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null,
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasTimer || currentTime <= 0) return;

    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasTimer, currentTime]);

  const setAnswer = useCallback((questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  }, [totalQuestions]);

  const prevQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToQuestion = useCallback(
    (index: number) => {
      setCurrentQuestionIndex(Math.max(0, Math.min(index, totalQuestions - 1)));
    },
    [totalQuestions],
  );

  const value = useMemo(
    () => ({
      currentTime,
      currentQuestionIndex,
      currentQuestionId,
      setCurrentQuestionId,
      totalQuestions,
      answers,
      setAnswer,
      nextQuestion,
      prevQuestion,
      goToQuestion,
    }),
    [
      currentTime,
      currentQuestionIndex,
      currentQuestionId,
      totalQuestions,
      answers,
      setAnswer,
      nextQuestion,
      prevQuestion,
      goToQuestion,
    ],
  );

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}

export function useTest() {
  const context = useContext(TestContext);
  if (!context) throw new Error("useTest must be used within TestProvider");
  return context;
}
