"use client";

import { Header } from "@/components/layout/Header";
import { TestProvider, useTest } from "@/lib/test/TestContext";
import { ReactNode } from "react";
import clockIcon from "@/assets/icons/clock.svg";
import arrowRightIcon from "@/assets/icons/arrow-right.svg";
import arrowLeftIcon from "@/assets/icons/arrow-left.svg";
import Image from "next/image";

export default function TestLayout({ children }: { children: ReactNode }) {
  return (
    <TestProvider durationSeconds={1200} totalQuestions={10}>
      <LayoutContent>{children}</LayoutContent>
    </TestProvider>
  );
}

function LayoutContent({ children }: { children: ReactNode }) {
  const {
    currentTime,
    currentQuestionIndex,
    totalQuestions,
    nextQuestion,
    prevQuestion,
  } = useTest();

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;

  const timeDisplay = `${String(minutes).padStart(3, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <>
      <Header />
      <div className="fixed top-41 left-39 z-40">
        <div
          className="flex items-center gap-5 px-5 py-2.5 backdrop-blur-[20px]
        border border-white/10 rounded-full"
        >
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
        <div className="max-w-137 mx-auto">
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
              className="disabled:opacity-30 disabled:cursor-not-allowed transition-opacity hover:cursor-pointer"
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

            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="disabled:opacity-30 disabled:cursor-not-allowed transition-opacity hover:cursor-pointer"
            >
              <Image
                src={arrowRightIcon}
                alt="arrow right"
                width={40}
                height={40}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
