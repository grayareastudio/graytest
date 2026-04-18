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
    <section className="relative overflow-hidden min-h-[550px] md:min-h-[650px] lg:min-h-[750px] flex items-center justify-center px-6 md:px-12 lg:px-39">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgVector}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center justify-center py-16 md:py-20 lg:py-25 space-y-6 md:space-y-8 lg:space-y-12">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white">
          W
        </h2>
        <p className="text-lg md:text-xl lg:text-2xl text-[#E5E5E5] text-center font-light max-w-2xl lg:max-w-3xl px-2">
          Your GrayPrint™ is a personalized report about your mind with
          practical insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 w-full">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative p-6 md:p-8 rounded-2xl bg-[#171717]/50 backdrop-blur-md flex flex-col items-center text-center transition-all duration-500 ease-out hover:-translate-y-1"
            >
              <div className="mb-4 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-[#404040] to-[#262626] flex items-center justify-center text-xl md:text-2xl font-serif text-white/80 transition-transform duration-500 group-hover:scale-110">
                {step.number}
              </div>
              <h3 className="font-serif text-lg md:text-xl text-[#D4D4D4] mb-3 md:mb-4.5 group-hover:text-white transition-colors">
                {step.title}
              </h3>
              <p className="text-xs md:text-sm text-[#A1A1A1] group-hover:text-[#D4D4D4] transition-colors">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
