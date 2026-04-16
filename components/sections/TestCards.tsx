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
    <section className="py-25 ">
      <div className="mx-auto px-39 space-y-11 flex flex-col items-center">
        <h2 className="font-serif text-5xl text-white">Choose Your Test</h2>
        <p className="text-xl text-[#D1D5DC]">
          Explore in minutes. Each test reveals a new layer of how your mind
          works.
        </p>

        <div className="grid grid-cols-4 gap-7 w-full">
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
