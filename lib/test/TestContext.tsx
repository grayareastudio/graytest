"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

interface TestContextType {
  currentTime: number;
  currentQuestionIndex: number;
  currentQuestionId: number | null;
  setCurrentQuestionId: (id: number | null) => void;
  totalQuestions: number;
  answers: Record<number, any>;
  setAnswer: (questionId: number, answer: any) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
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

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const setAnswer = (questionIndex: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <TestContext.Provider
      value={{
        currentTime,
        currentQuestionIndex,
        currentQuestionId,
        setCurrentQuestionId,
        totalQuestions,
        answers,
        setAnswer,
        nextQuestion,
        prevQuestion,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (!context) throw new Error("useTest must be used within TestProvider");
  return context;
}

export function useTestTimer() {
  const context = useContext(TestContext);
  return context;
}
