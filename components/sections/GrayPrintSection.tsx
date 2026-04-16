"use client";

import Image from "next/image";
import bgVector from "@/assets/bg-vector-1.svg";

const steps = [
  {
    number: "1",
    title: "Choose your path",
    description:
      "Pick from IQ, Personality, Spectrum, or EQ tests — depending on what you're most curious to explore.",
  },
  {
    number: "2",
    title: "Answer the questions",
    description: "Each test takes less than 10 minutes.",
  },
  {
    number: "3",
    title: "Unlock your GrayPrint™",
    description:
      "Get a personalized map of your mind — revealing strengths, blind spots, and practical next steps.",
  },
  {
    number: "4",
    title: "Turn insight into growth",
    description:
      "Use your results to understand yourself more deeply and make smarter choices every day.",
  },
];

export function GrayPrintSection() {
  return (
    <section className="relative overflow-hidden flex flex-col items-center justify-center">
      <Image src={bgVector} alt="Background" className="w-full h-auto" />
      <div className="absolute inset-0 z-10 w-full flex flex-col items-center justify-center space-y-12">
        <h2 className="font-serif text-5xl text-white">W</h2>

        <p className="text-2xl text-[#E5E5E5] text-center font-light">
          Your GrayPrint™ is a personalized report about your mind with
          practical insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step) => (
            <div
              key={step.number}
              className="
                group w-75 relative p-8 rounded-2xl 
                bg-[#171717]/50 backdrop-blur-md 
                flex flex-col items-center text-center 
                transition-all duration-500 ease-out
                hover:-translate-y-1
              "
            >
              {/* Badge */}
              <div
                className="
                mb-4 w-16 h-16 rounded-2xl 
                bg-linear-to-br from-[#404040] to-[#262626] 
                flex items-center justify-center 
                text-2xl font-serif text-white/80
                transition-transform duration-500 group-hover:scale-110
              "
              >
                {step.number}
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl text-[#D4D4D4] mb-4.5 group-hover:text-white transition-colors">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#A1A1A1] group-hover:text-[#D4D4D4] transition-colors">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
