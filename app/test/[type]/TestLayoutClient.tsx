"use client";

import { Header } from "@/components/layout/Header";
import { TestProvider, useTest } from "@/lib/test/TestContext";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitTestResults } from "@/lib/actions/test-actions";
import clockIcon from "@/assets/icons/clock.svg";
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
    totalQuestions,
    answers,
    nextQuestion,
    prevQuestion,
  } = useTest();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const timeDisplay = `${String(minutes).padStart(3, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSubmit = async () => {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (testType === "iq" && currentTime === 0 && !isSubmitting) {
      handleSubmit();
    }
  }, [currentTime, isSubmitting, testType]);

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
                disabled={isSubmitting}
                className={`
                  bg-[#D9D9D9] text-black px-4 py-1.5 md:px-6 md:py-2 rounded-full 
                  text-sm md:text-base font-medium transition-colors
                  ${isSubmitting ? "opacity-50 cursor-wait" : "hover:bg-white hover:cursor-pointer"}
                `}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={isSubmitting}
                className="hover:opacity-80 transition-opacity p-1 md:p-2 disabled:opacity-30 hover:cursor-pointer"
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
