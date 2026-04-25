import { Hero } from "@/components/sections/Hero";
import { MeasuresSection } from "@/components/sections/test/MeasuresSection";
import { BenefitsSection } from "@/components/sections/test/BenefitsSection";
import { WhySection } from "@/components/sections/WhySection";
import { InfoSection } from "@/components/sections/test/InfoSection";
import bgImage from "@/assets/iq-bg.svg";
import benefitsBg from "@/assets/iq-benefit.png";

export default function Page() {
  return (
    <main>
      <Hero
        title="Intelligence Quotient (IQ)"
        description="Measure your cognitive abilities across multiple domains including pattern recognition, logical reasoning, and problem-solving capabilities."
        buttonText="Start your assessment"
        href="/test/iq"
        videoSrc="/videos/iq.mp4"
        bgImage={bgImage}
        videoClassName="right-8 lg:right-39 aspect-9/7 object-cover w-2/5"
      />

      <MeasuresSection
        items={[
          {
            title: "Logical Reasoning",
            description:
              "Your ability to solve problems, identify patterns, and think abstractly.",
          },
          {
            title: "Quantitative Skills",
            description:
              "How you handle numerical problems and mathematical logic.",
          },
          {
            title: "Verbal Comprehension",
            description:
              "Your understanding of language, including vocabulary and verbal analogies.",
          },
          {
            title: "Memory and Processing Speed",
            description:
              "Short-term memory capacity and how quickly you can manipulate information.",
          },
        ]}
      />

      <BenefitsSection
        items={[
          {
            title: "Improve communication",
            description:
              "Find out if logic, math, language, or memory are your standout strengths—and put them to work in study, career, or problem-solving.",
          },
          {
            title: "Guide career or study choices",
            description:
              "Match your talents to fields where they’ll shine, whether that’s analytical work, creative problem-solving, or communication-heavy roles.",
          },
          {
            title: "Support weaker areas",
            description:
              "Spot the skills that need more practice, then use strategies, tools, or habits to give yourself an edge.",
          },
          {
            title: "Build confidence",
            description:
              "Recognize your abilities, challenge self-doubt, and gain motivation to pursue opportunities that fit your cognitive style.",
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
