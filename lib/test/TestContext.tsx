"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface TestContextType {
  currentTime: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: Record<number, any>;
  setAnswer: (questionId: number, answer: any) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  isFinished: boolean;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({
  children,
  durationSeconds,
  totalQuestions,
}: {
  children: ReactNode;
  durationSeconds: number;
  totalQuestions: number;
}) {
  const [currentTime, setCurrentTime] = useState(durationSeconds);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  useEffect(() => {
    if (currentTime <= 0) return;
    const timer = setInterval(() => {
      setCurrentTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentTime]);

  const setAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
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

  const isFinished =
    currentTime <= 0 || currentQuestionIndex === totalQuestions - 1;

  return (
    <TestContext.Provider
      value={{
        currentTime,
        currentQuestionIndex,
        totalQuestions,
        answers,
        setAnswer,
        nextQuestion,
        prevQuestion,
        isFinished,
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
