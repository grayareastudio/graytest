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
import Image from "next/image";

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
  const hasTimer = testType === "iq";

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
  } = useTest();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoSubmitRef = useRef(false);
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
    if (isSubmitting) return;
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    testType,
    durationSeconds,
    currentTime,
    answers,
    totalQuestions,
    userEmail,
    router,
  ]);

  useEffect(() => {
    if (
      testType.toLowerCase() === "iq" &&
      currentTime === 0 &&
      !isSubmitting &&
      !autoSubmitRef.current
    ) {
      autoSubmitRef.current = true;
      handleSubmit();
    }
  }, [testType, currentTime, isSubmitting, handleSubmit]);

  return (
    <>
      {/* Timer */}
      {testType === "iq" && (
        <div className="fixed top-20 md:top-24 lg:top-41 left-4 md:left-6 lg:left-39 z-40">
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
        </div>
      )}
      <button
        onClick={() => setShowQuestionList(true)}
        className="fixed top-20 md:top-24 lg:top-41 right-4 md:right-6 lg:right-39 z-40 text-xs md:text-sm text-white/70 hover:text-white transition-colors hover:cursor-pointer"
      >
        Question List ({totalAnswered}/{totalQuestions})
      </button>
      {showQuestionList && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowQuestionList(false)}
        >
          <div
            className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto"
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

      <main
        className={`flex flex-col items-center justify-center min-h-screen 
        ${testType === "iq" ? "pt-32 md:pt-40 lg:pt-40" : "pt-24 md:pt-28 lg:pt-32"} 
        pb-32 md:pb-44 lg:pb-58 px-4 md:px-8 lg:px-90`}
      >
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 pb-4 md:pb-6 lg:pb-25">
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
                    disabled={!allAnswered || isSubmitting}
                    className={`
                  bg-[#D9D9D9] text-black px-6 py-2 rounded-full 
                  text-sm md:text-base font-medium transition-colors
                  ${!allAnswered ? "opacity-50 cursor-not-allowed" : isSubmitting ? "opacity-50 cursor-wait" : "hover:bg-white hover:cursor-pointer"}
                `}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Test"}
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
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
