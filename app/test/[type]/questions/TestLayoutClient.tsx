"use client";

import { TestProvider, useTest } from "@/lib/test/TestContext";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitTestResults } from "@/lib/actions/test-actions";
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

  return (
    <TestProvider
      durationSeconds={durationSeconds}
      totalQuestions={totalQuestions}
      hasTimer={hasTimer}
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
    currentQuestionIndex,
    currentQuestionId,
    totalQuestions,
    answers,
    nextQuestion,
    prevQuestion,
  } = useTest();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoSubmitRef = useRef(false);

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const timeDisplay = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const [showQuestionList, setShowQuestionList] = useState(false);

  const hasValidAnswer = (val: any) => {
    if (val === undefined || val === null) return false;
    if (typeof val === "string") return val.trim() !== "";
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "object") return Object.keys(val).length > 0;
    return true;
  };

  const answeredCount = Object.values(answers).filter(hasValidAnswer).length;
  const allAnswered = answeredCount >= totalQuestions;

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

  const getQuestionStatus = (index: number) => {
    const questionId = index + 1; // Sesuaikan dengan logic ID Anda
    const answer = answers[questionId];
    return hasValidAnswer(answer) ? "answered" : "unanswered";
  };

  useEffect(() => {
    if (
      testType === "iq" &&
      currentTime === 0 &&
      !isSubmitting &&
      !autoSubmitRef.current
    ) {
      autoSubmitRef.current = true;
      handleSubmit();
    }
  }, [testType, currentTime, isSubmitting, handleSubmit]);

  const currentAnswer = answers[currentQuestionId ?? -1];
  const isAnswered = hasValidAnswer(currentAnswer);

  return (
    <>
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
      {showQuestionList && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowQuestionList(false)}
        >
          <div
            className="bg-white/20 border border-white/10 rounded-xl p-12 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg md:text-xl text-white font-medium">
                Question Navigator
              </h2>
              <button
                onClick={() => setShowQuestionList(false)}
                className="hover:cursor-pointer"
              >
                <Image src={deleteIcon} alt="delete" width={45} height={45} />
              </button>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 border border-white/40" />
                <span className="text-white/70">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-transparent border border-white/20" />
                <span className="text-white/70">Unanswered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#D9D9D9] border border-white/40" />
                <span className="text-white/70">Current</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-x-2.5 md:gap-y-6">
              {Array.from({ length: totalQuestions }, (_, index) => {
                const questionNum = index + 1;
                const status = getQuestionStatus(index);
                const isCurrent = index === currentQuestionIndex;
                const isAnswered = status === "answered";

                return (
                  <button
                    key={questionNum}
                    onClick={() => {
                      const targetIndex = index;
                      if (targetIndex < currentQuestionIndex) {
                        const diff = currentQuestionIndex - targetIndex;
                        for (let i = 0; i < diff; i++) prevQuestion();
                      } else if (targetIndex > currentQuestionIndex) {
                        const diff = targetIndex - currentQuestionIndex;
                        for (let i = 0; i < diff; i++) nextQuestion();
                      }
                      setShowQuestionList(false);
                    }}
                    className={` py-1
                      rounded-full text-xl font-semibold
                      transition-all duration-200 border
                      hover:cursor-pointer
                      ${
                        isCurrent
                          ? "bg-[#D9D9D9] text-black border-white/40"
                          : isAnswered
                            ? "bg-white/20 text-white border-white/40 hover:bg-white/30"
                            : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
                      }
                    `}
                  >
                    {questionNum}
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-white/70">Progress</span>
                <span className="text-white">
                  {answeredCount} of {totalQuestions} answered
                </span>
              </div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D9D9D9] transition-all duration-500"
                  style={{
                    width: `${(answeredCount / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <main
        className={`flex flex-col items-center justify-center min-h-screen ${testType === "iq" ? "pt-32 md:pt-40 lg:pt-40" : "pt-24 md:pt-28 lg:pt-32"} pb-32 md:pb-44 lg:pb-58 px-4 md:px-8 lg:px-90`}
      >
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 pb-4 md:pb-6 lg:pb-25">
        <div className="max-w-full md:max-w-137 mx-auto px-4 md:px-6">
          <div className="w-full h-1.5 md:h-2 bg-[#D9D9D9]/30 rounded-full mb-3 md:mb-5 overflow-hidden">
            <div
              className="h-full bg-[#D9D9D9] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={() => setShowQuestionList(true)}
            className="absolute top-0 right-10 text-xs md:text-sm text-white/70 hover:text-white transition-colors hover:cursor-pointer"
          >
            Question List ({answeredCount}/{totalQuestions})
          </button>
          <div className="flex items-center justify-center gap-3 md:gap-5 text-white">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0 || isSubmitting}
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
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className={`
                  bg-[#D9D9D9] text-black px-4 py-1.5 md:px-6 md:py-2 rounded-full 
                  text-sm md:text-base font-medium transition-colors
                  ${!allAnswered ? "opacity-50 cursor-not-allowed" : isSubmitting ? "opacity-50 cursor-wait" : "hover:bg-white hover:cursor-pointer"}
                `}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
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
        </div>
      </div>
    </>
  );
}
