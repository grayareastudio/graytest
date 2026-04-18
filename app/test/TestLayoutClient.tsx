"use client";

import { Header } from "@/components/layout/Header";
import { TestProvider, useTest } from "@/lib/test/TestContext";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import clockIcon from "@/assets/icons/clock.svg";
import arrowRightIcon from "@/assets/icons/arrow-right.svg";
import arrowLeftIcon from "@/assets/icons/arrow-left.svg";
import Image from "next/image";

interface TestLayoutClientProps {
  children: ReactNode;
  durationSeconds: number;
  totalQuestions: number;
}

export function TestLayoutClient({
  children,
  durationSeconds,
  totalQuestions,
}: TestLayoutClientProps) {
  return (
    <TestProvider
      durationSeconds={durationSeconds}
      totalQuestions={totalQuestions}
    >
      <LayoutContent>{children}</LayoutContent>
    </TestProvider>
  );
}

function LayoutContent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const {
    currentTime,
    currentQuestionIndex,
    totalQuestions,
    answers,
    nextQuestion,
    prevQuestion,
  } = useTest();

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const timeDisplay = `${String(minutes).padStart(3, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSubmit = () => {
    console.log("Submitting fake data:", answers);

    router.push(`/results/fake-test-id-${Date.now()}`);
  };

  useEffect(() => {
    if (currentTime === 0) {
      handleSubmit();
    }
  }, [currentTime]);

  return (
    <>
      <Header />

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

      <main className="flex flex-col items-center justify-center min-h-screen pt-32 md:pt-40 lg:pt-40 pb-32 md:pb-44 lg:pb-58 px-4 md:px-8 lg:px-90">
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
              disabled={currentQuestionIndex === 0}
              className="disabled:opacity-30 disabled:cursor-not-allowed transition-opacity p-1 md:p-2"
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
                className="bg-[#D9D9D9] text-black px-4 py-1.5 md:px-6 md:py-2 rounded-full text-sm md:text-base font-medium hover:bg-white transition-colors"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="hover:opacity-80 transition-opacity p-1 md:p-2"
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
