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

      <div className="fixed top-41 left-39 z-40">
        <div className="flex items-center gap-5 px-5 py-2.5 backdrop-blur-[20px] border border-white/10 rounded-full">
          <Image src={clockIcon} alt="clock" width={40} height={40} />
          <span
            className={`text-2xl ${currentTime <= 60 ? "text-red-400" : ""}`}
          >
            {timeDisplay}
          </span>
        </div>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen pt-40 pb-58 px-90">
        {children}
      </main>

      <div className="fixed bottom-25 left-0 right-0">
        <div className="max-w-137 mx-auto px-6">
          <div className="w-full h-2 bg-[#D9D9D9]/30 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-[#D9D9D9] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-5 text-white">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              <Image
                src={arrowLeftIcon}
                alt="arrow left"
                width={40}
                height={40}
              />
            </button>

            <span className="text-2xl min-w-14 text-center">
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>

            {/* ✅ Tombol Submit */}
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                className="bg-[#D9D9D9] text-black px-6 py-2 rounded-full font-medium hover:bg-white transition-colors"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src={arrowRightIcon}
                  alt="arrow right"
                  width={40}
                  height={40}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
