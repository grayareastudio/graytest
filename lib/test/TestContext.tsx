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

export interface Dimension {
  id: string;
  code?: string;
  name: string;
  description?: string;
  info_content?: string;
  sort_order: number;
  questions: Question[];
}

export interface Question {
  id: number;
  dimension_id: string;
  type: string; // "radio" | "checkbox" | "matrix" | "open" | "visual"
  text: string;
  options?: any[];
  rows?: any[];
  mainImage?: string;
  reverse_scored?: boolean;
  sort_order: number;
}

export interface TestContextType {
  // Data utama
  dimensions: Dimension[];
  currentDimensionIndex: number;
  currentQuestionIndex: number;
  currentQuestionId: number | null;

  // UI State
  showDimensionInfo: boolean;
  totalQuestions: number;
  answers: Record<number, any>;

  // Timer
  currentTime: number;
  hasTimer: boolean;

  // Actions
  setAnswer: (questionId: number, answer: any) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;

  nextDimension: () => void;
  prevDimension: () => void;
  goToDimension: (index: number) => void;
  goToQuestionInDimension: (
    dimensionIndex: number,
    questionIndex: number,
  ) => void;

  setShowDimensionInfo: (show: boolean) => void;

  // Helper
  currentDimension: Dimension | null;
  currentQuestion: Question | null;
  isLastQuestionInDimension: boolean;
  isLastDimension: boolean;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

interface TestProviderProps {
  children: ReactNode;
  durationSeconds: number;
  totalQuestions: number;
  hasTimer?: boolean;
  initialDimensions?: Dimension[];
}

export function TestProvider({
  children,
  durationSeconds,
  totalQuestions,
  hasTimer = false,
  initialDimensions = [],
}: TestProviderProps) {
  const [dimensions, setDimensions] = useState<Dimension[]>(initialDimensions);
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showDimensionInfo, setShowDimensionInfo] = useState(true);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null,
  );
  const [currentTime, setCurrentTime] = useState(durationSeconds);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasTimer || currentTime <= 0 || showDimensionInfo) return;

    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasTimer, currentTime, showDimensionInfo]);

  useEffect(() => {
    const currentDim = dimensions[currentDimensionIndex];
    if (!currentDim) return;

    const currentQ = currentDim.questions[currentQuestionIndex];
    setCurrentQuestionId(currentQ?.id ?? null);
  }, [dimensions, currentDimensionIndex, currentQuestionIndex]);

  const currentDimension = dimensions[currentDimensionIndex] || null;
  const currentQuestion =
    currentDimension?.questions[currentQuestionIndex] || null;

  const totalQuestionsInCurrentDimension =
    currentDimension?.questions.length || 0;
  const isLastQuestionInDimension =
    currentQuestionIndex === totalQuestionsInCurrentDimension - 1;
  const isLastDimension = currentDimensionIndex === dimensions.length - 1;

  const setAnswer = useCallback((questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentDimensionIndex > 0) {
      prevDimension();
    }
  }, [currentQuestionIndex, currentDimensionIndex]);

  const goToQuestion = useCallback(
    (index: number) => {
      if (!currentDimension) return;
      const max = currentDimension.questions.length - 1;
      setCurrentQuestionIndex(Math.max(0, Math.min(index, max)));
    },
    [currentDimension],
  );

  const nextDimension = useCallback(() => {
    if (currentDimensionIndex < dimensions.length - 1) {
      setCurrentDimensionIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      setShowDimensionInfo(true);
    }
  }, [currentDimensionIndex, dimensions.length]);

  const prevDimension = useCallback(() => {
    if (currentDimensionIndex > 0) {
      const prevIndex = currentDimensionIndex - 1;
      const prevDimensionData = dimensions[prevIndex];
      const lastQuestionIndex = prevDimensionData.questions.length - 1;

      setCurrentDimensionIndex(prevIndex);
      setCurrentQuestionIndex(lastQuestionIndex);
      setShowDimensionInfo(false);
    }
  }, [currentDimensionIndex, dimensions]);

  const goToDimension = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(index, dimensions.length - 1));
      setCurrentDimensionIndex(validIndex);
      setCurrentQuestionIndex(0);
      setShowDimensionInfo(true);
    },
    [dimensions.length],
  );

  const goToQuestionInDimension = useCallback(
    (dimensionIndex: number, questionIndex: number) => {
      const validDimIndex = Math.max(
        0,
        Math.min(dimensionIndex, dimensions.length - 1),
      );

      setCurrentDimensionIndex(validDimIndex);
      setCurrentQuestionIndex(Math.max(0, questionIndex));
      setShowDimensionInfo(false);
    },
    [dimensions.length],
  );

  const nextQuestion = useCallback(() => {
    if (!currentDimension) return;

    const maxIndex = currentDimension.questions.length - 1;

    if (currentQuestionIndex < maxIndex) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (!isLastDimension) {
      const answeredInCurrent = currentDimension.questions.filter((q: any) => {
        const ans = answers[q.id];
        return (
          ans !== undefined &&
          ans !== null &&
          (typeof ans !== "string" || ans.trim() !== "") &&
          (!Array.isArray(ans) || ans.length > 0)
        );
      }).length;

      nextDimension();
    }
  }, [
    currentDimension,
    currentQuestionIndex,
    isLastDimension,
    answers,
    nextDimension,
  ]);

  const value = useMemo(
    () => ({
      dimensions,
      currentDimensionIndex,
      currentQuestionIndex,
      currentQuestionId,
      showDimensionInfo,
      totalQuestions,
      answers,
      currentTime,
      hasTimer,
      currentDimension,
      currentQuestion,
      isLastQuestionInDimension,
      isLastDimension,

      setAnswer,
      nextQuestion,
      prevQuestion,
      goToQuestion,
      nextDimension,
      prevDimension,
      goToDimension,
      goToQuestionInDimension,
      setShowDimensionInfo,
    }),
    [
      dimensions,
      currentDimensionIndex,
      currentQuestionIndex,
      currentQuestionId,
      showDimensionInfo,
      totalQuestions,
      answers,
      currentTime,
      hasTimer,
      currentDimension,
      currentQuestion,
      isLastQuestionInDimension,
      isLastDimension,
      setAnswer,
      nextQuestion,
      prevQuestion,
      goToQuestion,
      nextDimension,
      prevDimension,
      goToDimension,
      goToQuestionInDimension,
    ],
  );

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}

export function useTest() {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
}
