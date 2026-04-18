import { Hero } from "@/components/sections/Hero";
import { MeasuresSection } from "@/components/sections/test/MeasuresSection";
import { BenefitsSection } from "@/components/sections/test/BenefitsSection";
import { WhySection } from "@/components/sections/WhySection";
import { InfoSection } from "@/components/sections/test/InfoSection";
import bgImage from "@/assets/spectrum-bg.svg";
import benefitsBg from "@/assets/spectrum-benefit.png";

export default function Page() {
  return (
    <main>
      <Hero
        title="S"
        description="This assessment explores how your brain processes the world—socially, behaviorally, and sensorially."
        buttonText="Start your assessment"
        videoSrc="/videos/spectrum.mp4"
        bgImage={bgImage}
        videoClassName="right-8 lg:right-39 aspect-square rounded-full w-1/3 object-cover"
      />

      <MeasuresSection
        items={[
          {
            title: "Social Communication",
            description:
              "Questions will gauge how comfortable you are in social situations.",
          },
          {
            title: "Repetitive Behaviors",
            description:
              "The test looks at your need for sameness and routines.",
          },
          {
            title: "Special Interests and Focus",
            description: "It will ask about the intensity of your interests.",
          },
          {
            title: "Sensory Sensitivities",
            description:
              "The test may probe sensitivities or atypical responses you have to STIMULI.",
          },
        ]}
      />

      <BenefitsSection
        items={[
          {
            title: "Gain validation",
            description:
              "See your habits and tendencies clearly, so you can lean into your strengths and work on challenges without self-blame.",
          },
          {
            title: "Improve self-care",
            description:
              "Match your talents to fields where they’ll shine, whether that’s analytical work, creative problem-solving, or communication-heavy roles.",
          },
          {
            title: "Seek professional support",
            description:
              "Match your talents to fields where they’ll shine, whether that’s analytical work, creative problem-solving, or communication-heavy roles.",
          },
          {
            title: "Connect with community",
            description:
              "Match your talents to fields where they’ll shine, whether that’s analytical work, creative problem-solving, or communication-heavy roles.",
          },
        ]}
        bgImage={benefitsBg}
      />

      <WhySection />

      <InfoSection
        info={{
          duration: "6–10 min",
          questions: "5 (open ended)",
          result: "Instant",
        }}
      />
    </main>
  );
}
