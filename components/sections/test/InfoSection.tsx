"use client";

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import bgVector2 from "@/assets/bg-vector-2.svg";

interface Info {
  duration: string;
  questions: string;
  result: string;
}

interface InfoSectionProps {
  info: Info;
  onStart?: () => void;
}

export function InfoSection({ info, onStart }: InfoSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-16 lg:py-0 px-6 md:px-12 lg:px-39">
      {/* ✅ Fix: objectFit deprecated, gunakan className + priority */}
      <Image
        src={bgVector2}
        alt="Wavy Background"
        fill
        className="object-cover"
        priority
      />

      <div className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-xl flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-6 pb-8 md:p-8 md:pb-12 lg:p-10 lg:pb-15 backdrop-blur-sm">
        <h2 className="font-serif text-xl md:text-2xl text-white text-center mb-6 md:mb-8 font-light tracking-wide">
          Test Information
        </h2>

        <div className="space-y-4 md:space-y-6 lg:space-y-8 mb-8 md:mb-10 lg:mb-15 w-full">
          <div className="flex justify-between items-center py-2.5 border-b border-white/10">
            <span className="text-xs md:text-sm text-white/50">Duration</span>
            <span className="text-xs md:text-sm text-white font-medium">
              {info.duration}
            </span>
          </div>
          <div className="flex justify-between items-center py-2.5 border-b border-white/10">
            <span className="text-xs md:text-sm text-white/50">
              Number of Questions
            </span>
            <span className="text-xs md:text-sm text-white font-medium">
              {info.questions}
            </span>
          </div>
          <div className="flex justify-between items-center py-2.5 border-b border-white/10">
            <span className="text-xs md:text-sm text-white/50">Results</span>
            <span className="text-xs md:text-sm text-white font-medium">
              {info.result}
            </span>
          </div>
        </div>

        <Button onClick={onStart}>Start your assessment</Button>
      </div>
    </section>
  );
}
