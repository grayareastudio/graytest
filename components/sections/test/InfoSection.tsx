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
    <section className="relative h-screen flex items-center justify-center overflow-hidden ">
      <Image src={bgVector2} alt="Wavy Background" fill objectFit="cover" />

      <div className="relative z-10 flex flex-col items-center bg-white/0.2 border border-white/10 rounded-2xl p-10 pb-15 backdrop-blur-sm">
        <h2 className="font-serif text-2xl text-white text-center mb-8 font-light tracking-wide">
          Test Information
        </h2>

        <div className="space-y-8 mb-15">
          <div className="flex justify-between gap-40 items-center py-2.5 border-b border-white/10">
            <span className="text-sm text-white/50">Duration</span>
            <span className="text-sm text-white">{info.duration}</span>
          </div>
          <div className="flex justify-between gap-40 items-center py-2.5 border-b border-white/10">
            <span className="text-sm text-white/50">Number of Questions</span>
            <span className="text-sm text-white">{info.questions}</span>
          </div>
          <div className="flex justify-between gap-40 items-center py-2.5 border-b border-white/10">
            <span className="text-sm text-white/50">Results</span>
            <span className="text-sm text-white">{info.result}</span>
          </div>
        </div>

        <Button onClick={onStart}>Start your assessment</Button>
      </div>
    </section>
  );
}
