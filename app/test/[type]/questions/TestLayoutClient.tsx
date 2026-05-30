"use client";

import { TestProvider, useTest } from "@/lib/test/TestContext";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  submitTestResults,
  getTestWithDimensions,
} from "@/lib/actions/test-actions";
import clockIcon from "@/assets/icons/clock.svg";
import deleteIcon from "@/assets/icons/delete.svg";
import arrowRightIcon from "@/assets/icons/arrow-right.svg";
import arrowLeftIcon from "@/assets/icons/arrow-left.svg";
import bgVector from "@/assets/bg-vector-1.svg";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FooterTest } from "@/components/layout/FooterTest";

interface TestLayoutClientProps {
  children: ReactNode;
  durationSeconds: number;
  totalQuestions: number;
  testType: string;
  userEmail?: string;
}

export function TestLayoutClient({
  children,
  durationSeconds,
  totalQuestions,
  testType,
  userEmail,
}: TestLayoutClientProps) {
  const hasTimer = true;

  const [dimensions, setDimensions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestData() {
      try {
        const data = await getTestWithDimensions(testType);
        setDimensions(data);
      } catch (error) {
        console.error("Failed to load test dimensions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTestData();
  }, [testType]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white text-xl">Loading test structure...</p>
      </div>
    );
  }

  return (
    <TestProvider
      durationSeconds={durationSeconds}
      totalQuestions={totalQuestions}
      hasTimer={hasTimer}
      initialDimensions={dimensions}
    >
      <LayoutContent
        testType={testType}
        durationSeconds={durationSeconds}
        userEmail={userEmail}
      >
        {children}
      </LayoutContent>
    </TestProvider>
  );
}

function LayoutContent({
  children,
  testType,
  durationSeconds,
  userEmail,
}: {
  children: ReactNode;
  testType: string;
  durationSeconds: number;
  userEmail?: string;
}) {
  const router = useRouter();
  const {
    currentTime,
    currentDimensionIndex,
    currentQuestionIndex,
    dimensions,
    currentDimension,
    goToDimension,
    goToQuestionInDimension,
    currentQuestionId,
    totalQuestions,
    answers,
    nextQuestion,
    prevQuestion,
    isLastQuestionInDimension,
    isLastDimension,
    showDimensionInfo,
    setAnswer,
  } = useTest();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skippedMode, setSkippedMode] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const autoSubmitRef = useRef(false);

  useEffect(() => {
    if (!userEmail) return;

    const saved = localStorage.getItem("pendingTestAnswers");
    if (!saved) return;

    let parsedAnswers: Record<number, any> | null = null;
    try {
      const { savedTestType, savedAnswers } = JSON.parse(saved);
      if (savedTestType !== testType) {
        localStorage.removeItem("pendingTestAnswers");
        return;
      }
      parsedAnswers = savedAnswers;
    } catch {
      localStorage.removeItem("pendingTestAnswers");
      return;
    }

    localStorage.removeItem("pendingTestAnswers");
    
    Object.entries(parsedAnswers!).forEach(([id, answer]) => {
      setAnswer(Number(id), answer);
    });
    
    setIsSubmitting(true);
    setIsAutoSubmitting(true);
    const actualDuration =
      testType === "iq" ? durationSeconds - currentTime : undefined;

    submitTestResults(
      testType,
      parsedAnswers!,
      totalQuestions,
      actualDuration,
      userEmail,
    )
      .then((result) => {
        router.push(`/results/${result.id}`);
      })
      .catch((err) => {
        console.error("Auto-submit failed:", err);
        setIsSubmitting(false);
        setIsAutoSubmitting(false);
      });  
  }, [userEmail]);
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const [showQuestionList, setShowQuestionList] = useState(false);

  const currentDimensionTotalQuestions =
    currentDimension?.questions?.length || 0;

  const totalAnswered = Object.values(answers).filter((val) => {
    if (val === undefined || val === null) return false;
    if (typeof val === "string") return val.trim() !== "";
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "object" && val !== null)
      return Object.keys(val).length > 0;
    return true;
  }).length;

  const allAnswered = totalAnswered >= totalQuestions;

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const timeDisplay = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const dimensionProgress = dimensions.map((dimension, index) => {
    const questionsInDim = dimension.questions || [];
    const totalInDim = questionsInDim.length;

    const answeredInDim = questionsInDim.filter((q: any) => {
      const answer = answers[q.id];
      if (answer === undefined || answer === null) return false;
      if (typeof answer === "string") return answer.trim() !== "";
      if (Array.isArray(answer)) return answer.length > 0;
      if (typeof answer === "object" && answer !== null)
        return Object.keys(answer).length > 0;
      return true;
    }).length;

    let progressPercent = 0;

    if (index < currentDimensionIndex) {
      progressPercent = 100;
    } else if (index === currentDimensionIndex) {
      if (totalInDim > 0) {
        progressPercent = Math.round(
          ((currentQuestionIndex + 1) / totalInDim) * 100,
        );
      }
    } else {
      progressPercent = 0;
    }

    const isCompleted = answeredInDim === totalInDim && totalInDim > 0;
    const isCurrent = index === currentDimensionIndex;

    return {
      index,
      name: dimension.name,
      total: totalInDim,
      answered: answeredInDim,
      progress: progressPercent,
      isCurrent,
      isCompleted,
    };
  });

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || isTimeUp) return;

    if (!allAnswered) {
      for (let dimIdx = 0; dimIdx < dimensions.length; dimIdx++) {
        const dim = dimensions[dimIdx];
        for (let qIdx = 0; qIdx < dim.questions.length; qIdx++) {
          const q = dim.questions[qIdx];
          const ans = answers[q.id];
          const isEmpty =
            ans === undefined ||
            ans === null ||
            (typeof ans === "string" && ans.trim() === "") ||
            (Array.isArray(ans) && ans.length === 0) ||
            (typeof ans === "object" && !Array.isArray(ans) && Object.keys(ans).length === 0);
          if (isEmpty) {
            goToQuestionInDimension(dimIdx, qIdx);
            setSkippedMode(true);
            return;
          }
        }
      }
    }

    if (!userEmail) {
      setShowLoginModal(true);
      return;
    }

    setIsSubmitting(true);
    setIsAutoSubmitting(true);

    try {
      const actualDuration =
        testType === "iq" ? durationSeconds - currentTime : undefined;

      const result = await submitTestResults(
        testType,
        answers,
        totalQuestions,
        actualDuration,
        userEmail,
      );
      router.push(`/results/${result.id}`);
    } catch (error) {
      console.error("Submit failed:", error);
      setIsSubmitting(false);
      setIsAutoSubmitting(false);
    }
  }, [
    isSubmitting,
    isTimeUp,
    allAnswered,
    userEmail,
    dimensions,
    answers,
    goToQuestionInDimension,
    testType,
    durationSeconds,
    currentTime,
    totalQuestions,
    router,
  ]);

  useEffect(() => {
    if (skippedMode && allAnswered) {
      setSkippedMode(false);
    }
  }, [skippedMode, allAnswered]);

  const goToNextSkipped = useCallback(() => {
    for (let dimIdx = 0; dimIdx < dimensions.length; dimIdx++) {
      const dim = dimensions[dimIdx];
      for (let qIdx = 0; qIdx < dim.questions.length; qIdx++) {
        const q = dim.questions[qIdx];
        if (dimIdx === currentDimensionIndex && qIdx === currentQuestionIndex) continue;
        const ans = answers[q.id];
        const isEmpty =
          ans === undefined ||
          ans === null ||
          (typeof ans === "string" && ans.trim() === "") ||
          (Array.isArray(ans) && ans.length === 0) ||
          (typeof ans === "object" && !Array.isArray(ans) && Object.keys(ans).length === 0);
        if (isEmpty) {
          goToQuestionInDimension(dimIdx, qIdx);
          return;
        }
      }
    }
  }, [dimensions, currentDimensionIndex, currentQuestionIndex, answers, goToQuestionInDimension]);

  useEffect(() => {
    if (
      currentTime === 0 &&
      !isSubmitting &&
      !autoSubmitRef.current
    ) {
      autoSubmitRef.current = true;
      setIsTimeUp(true);
    }
  }, [currentTime, isSubmitting]);

  return (
    <>
      {/* loading auto-submit */}
      {isAutoSubmitting && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <div className="text-center">
              <p className="font-serif text-2xl text-white mb-2">
                Submitting your results...
              </p>
              <p className="text-sm text-white/50">
                Please wait a moment
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Skipped Questions Banner */}
      {skippedMode && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500/10 border-t border-amber-500/30 backdrop-blur-sm">
          <div className="max-w-full md:max-w-137 mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
              <p className="text-sm text-amber-200 truncate">
                <span className="font-medium">
                  {totalQuestions - totalAnswered} question{totalQuestions - totalAnswered !== 1 ? "s" : ""} remaining
                </span>
                <span className="text-amber-200/60 ml-1 hidden sm:inline">— answer them to submit</span>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setSkippedMode(false)}
                className="text-xs text-white/40 hover:text-white/70 transition-colors hover:cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Timer */}
      <div className="flex items-center gap-3 fixed top-24 md:top-28 lg:top-41 left-4 md:left-6 lg:left-39 z-40">
        <div className="flex items-center gap-3 md:gap-5 px-4 py-2 md:px-5 md:py-2.5 backdrop-blur-[20px] border border-white/10 rounded-full">
          <Image
            src={clockIcon}
            alt="clock"
            width={32}
            height={32}
            className="md:w-10 md:h-10"
          />
          <span
            className={`text-lg md:text-2xl ${currentTime <= 60 ? "text-red-400" : ""}`}
          >
            {timeDisplay}
          </span>
        </div>
        <p className="z-40 text-s md:text-sm text-white">
          Answered Questions ({totalAnswered}/{totalQuestions})
        </p>
      </div>

      <Button 
        className="fixed top-24 md:top-28 lg:top-41 right-4 md:right-6 lg:right-39 z-40"
        onClick={() => setShowQuestionList(true)}
      >
        See full Questions List
      </Button>
      {showQuestionList && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowQuestionList(false)}
        >
          <div
            className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-4xl w-full mx-4 h-2/3 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-white font-medium">
                Question Navigator
              </h2>
              <button
                onClick={() => setShowQuestionList(false)}
                className="text-white/70 hover:text-white transition-colors hover:cursor-pointer"
              >
                <Image src={deleteIcon} alt="close" width={36} height={36} />
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-emerald-500" />
                <span className="text-white/80">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded border border-white/30" />
                <span className="text-white/80">Unanswered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-white" />
                <span className="text-white/80">Current</span>
              </div>
            </div>

            {/* Questions grouped by Dimension */}
            <div className="space-y-12">
              {dimensions.map((dimension, dimIndex) => {
                const questionsInDim = dimension.questions || [];
                const isCurrentDimension = dimIndex === currentDimensionIndex;

                return (
                  <div key={dimension.id} className="space-y-6">
                    <button
                      onClick={() => {
                        goToDimension(dimIndex);
                        setShowQuestionList(false);
                      }}
                      className="flex items-center gap-3 w-full font-serif text-xl text-white hover:text-white/90 hover:bg-white/5 p-2 rounded-xl transition-colors group hover:cursor-pointer"
                    >
                      {dimension.name}
                    </button>

                    {/* Question Grid */}
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 pl-2">
                      {questionsInDim.map((question: any, qIndex: number) => {
                        const isAnswered = !!answers[question.id];
                        const isCurrent =
                          isCurrentDimension && qIndex === currentQuestionIndex;

                        return (
                          <button
                            key={question.id}
                            onClick={() => {
                              goToQuestionInDimension(dimIndex, qIndex);
                              setShowQuestionList(false);
                            }}
                            className={`py-1 rounded-full text-xl font-semibold transition-all duration-200 border hover:cursor-pointer ${
                              isCurrent
                                ? "bg-white text-black border-white shadow-md"
                                : isAnswered
                                  ? "bg-emerald-500/90 text-white border-emerald-500 hover:bg-emerald-500"
                                  : "bg-transparent border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                            }`}
                          >
                            {qIndex + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Total Progress</span>
                <span className="text-white font-medium">
                  {totalAnswered} / {totalQuestions} answered
                </span>
              </div>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{
                    width: `${(totalAnswered / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Required Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-white font-medium">
                Login Required
              </h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-white/70 hover:text-white transition-colors hover:cursor-pointer"
              >
                <Image src={deleteIcon} alt="close" width={36} height={36} />
              </button>
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-8">
              You need to be logged in to submit your test results. Create an
              account or log in to save your progress and see your full
              analysis.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  localStorage.setItem(
                    "pendingTestAnswers",
                    JSON.stringify({ savedTestType: testType, savedAnswers: answers }),
                  );
                  router.push(`/login?redirect=/test/${testType}/questions`);
                }}
                className="flex-1 bg-[#E5E5E5] text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-white transition-colors hover:cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  localStorage.setItem(
                    "pendingTestAnswers",
                    JSON.stringify({ savedTestType: testType, savedAnswers: answers }),
                  );
                  router.push(`/register?redirect=/test/${testType}/questions`);
                }}
                className="flex-1 bg-[#E5E5E5]/20 border border-white/10 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition-colors hover:cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time's Up Modal */}
      {isTimeUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center mb-6">
              {/* Clock icon */}
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                  />
                </svg>
              </div>
              <h2 className="font-serif text-2xl text-white font-medium mb-2">
                Time's Up
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Your time has run out. You can go back to the home page or
                retake the test from the beginning.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-[#E5E5E5] text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-white transition-colors hover:cursor-pointer"
              >
                Back to Home
              </button>
              <button
                onClick={() => router.push(`/test/${testType}/intro`)}
                className="flex-1 bg-[#E5E5E5]/20 border border-white/10 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition-colors hover:cursor-pointer"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        className={`relative flex flex-col items-center justify-center min-h-screen 
        ${testType === "iq" ? "pt-32 md:pt-40 lg:pt-40" : "pt-24 md:pt-28 lg:pt-32"} 
        pb-32 md:pb-44 lg:pb-58 px-4 md:px-8 lg:px-90`}
      >
        {!showDimensionInfo && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src={bgVector}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-60"
              priority
            />
          </div>
        )}
        <div className="relative z-10 w-full flex flex-col items-center">
          {children}
        </div>
      </main>
      <FooterTest />

      <div className={`fixed bottom-0 left-0 right-0 pb-4 md:pb-6 lg:pb-30 transition-all duration-200 ${skippedMode ? "pb-14 md:pb-16 lg:pb-30" : ""}`}>
        <div className="max-w-full md:max-w-137 mx-auto px-4 md:px-6">
          <div className="flex gap-2.5 mb-4">
            {dimensionProgress.map((dim, idx) => (
              <div
                key={idx}
                className={
                  "flex-1 h-2 rounded-full overflow-hidden ring ring-white"
                }
              >
                <div
                  className="h-full transition-all duration-500 bg-[#D9D9D9]/80"
                  style={{ width: `${dim.progress}%` }}
                />
              </div>
            ))}
          </div>
          {!showDimensionInfo && (
            <>
              <div className="flex items-center justify-center gap-3 md:gap-5 text-white">
                <button
                  onClick={prevQuestion}
                  disabled={isSubmitting}
                  className="hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity p-1 md:p-2 hover:cursor-pointer"
                >
                  <Image
                    src={arrowLeftIcon}
                    alt="arrow left"
                    width={32}
                    height={32}
                    className="md:w-10 md:h-10"
                  />
                </button>

                <span className="text-lg md:text-2xl min-w-12 md:min-w-14 text-center">
                  {currentQuestionIndex + 1}/{currentDimensionTotalQuestions}
                </span>

                {isLastDimension && isLastQuestionInDimension ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isTimeUp}
                    className={`
                  bg-[#D9D9D9] text-black px-6 py-2 rounded-full 
                  text-sm md:text-base font-medium transition-colors
                  ${isSubmitting || isTimeUp ? "opacity-50 cursor-wait" : "hover:bg-white hover:cursor-pointer"}
                `}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : isTimeUp
                        ? "Time's up"
                        : !allAnswered
                          ? `Submit (${totalAnswered}/${totalQuestions})`
                          : "Submit Test"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (skippedMode) {
                        goToNextSkipped();
                      } else if (allAnswered && !(isLastDimension && isLastQuestionInDimension)) {
                        const lastDimIdx = dimensions.length - 1;
                        const lastQIdx = dimensions[lastDimIdx].questions.length - 1;
                        goToQuestionInDimension(lastDimIdx, lastQIdx);
                      } else {
                        nextQuestion();
                      }
                    }}
                    disabled={isSubmitting}
                    className="hover:opacity-80 transition-opacity p-1 md:p-2 disabled:opacity-30 hover:cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Image
                      src={arrowRightIcon}
                      alt="arrow right"
                      width={32}
                      height={32}
                      className="md:w-10 md:h-10"
                    />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
