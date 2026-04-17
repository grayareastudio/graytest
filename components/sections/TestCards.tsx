"use client";
import { Button } from "@/components/ui/Button";
import { TestCard } from "./TestCard";
import iqBg from "@/assets/test/iq-bg.png";
import eqBg from "@/assets/test/eq-bg.png";
import personalityBg from "@/assets/test/personality-bg.png";
import spectrumBg from "@/assets/test/spectrum-bg.png";

const tests = [
  {
    title: "IQ",
    description: "Discover your unique problem-solving strengths.",
    duration: "~15 mins",
    price: "$4.99",
    imageBg: iqBg,
    badge: "Coming Soon",
  },
  {
    title: "EQ",
    description: "See how you understand, manage, and express emotions.",
    duration: "~15 mins",
    price: "$4.99",
    imageBg: eqBg,
  },
  {
    title: "Personality",
    description: "Understand your core character traits via Big Five OCEAN.",
    duration: "~12 mins",
    price: "$4.99",
    imageBg: personalityBg,
  },
  {
    title: "Spectrum",
    description: "Map how your brain processes the social and sensory world.",
    duration: "~15 mins",
    price: "$4.99",
    imageBg: spectrumBg,
  },
];

export function TestCards() {
  const handleAssessment = (testType: string) => {};

  return (
    <section
      className="py-16 md:py-20 lg:py-25 px-6 md:px-12 lg:px-39"
      id="tests"
    >
      <div className="mx-auto space-y-6 md:space-y-8 lg:space-y-11 flex flex-col items-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white text-center">
          Choose Your Test
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-[#D1D5DC] text-center max-w-2xl">
          Explore in minutes. Each test reveals a new layer of how your mind
          works.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7 w-full max-w-7xl">
          {tests.map((test) => (
            <TestCard
              key={test.title}
              {...test}
              onAssessment={() => handleAssessment(test.title)}
              onAbout={() => console.log("About", test.title)}
            />
          ))}
        </div>

        <div className="relative inline-block">
          <div className="absolute -top-4 right-0 bg-black/10 backdrop-blur-md rounded-full px-2 py-1 text-xs font-semibold border border-white">
            Save 25%
          </div>
          <Button variant="secondary" size="md">
            Bundle all tests
          </Button>
        </div>
      </div>
    </section>
  );
}
