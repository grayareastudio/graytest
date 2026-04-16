import { Hero } from "@/components/sections/Hero";
import { MeasuresSection } from "@/components/sections/test/MeasuresSection";
import { BenefitsSection } from "@/components/sections/test/BenefitsSection";
import { WhySection } from "@/components/sections/WhySection";
import { InfoSection } from "@/components/sections/test/InfoSection";
import heroImage from "@/assets/spectrum-hero.png";
import bgImage from "@/assets/spectrum-bg.svg";
import benefitsBg from "@/assets/spectrum-benefit.png";

export default function Page() {
  return (
    <main>
      <Hero
        title="E"
        description="Emotional intelligence gives you tools to navigate daily life with more balance and clarity."
        buttonText="Start your assessment"
        image={heroImage}
        bgImage={bgImage}
      />

      <MeasuresSection
        items={[
          {
            title: "Self-Awareness",
            description:
              "Your ability to identify and understand your own emotions and their impact.",
          },
          {
            title: "Self-Regulation",
            description:
              "How well you manage or adjust your emotions and impulses.",
          },
          {
            title: "Empathy",
            description:
              "Your capacity to perceive and understand others’ feelings.",
          },
          {
            title: "Social Skills",
            description:
              "How you use emotional insight to build relationships and navigate social situations.",
          },
        ]}
      />

      <BenefitsSection
        items={[
          {
            title: "Improve communication",
            description:
              "Learn to express yourself clearly and listen with empathy, making tough conversations with friends, family, or coworkers smoother and more meaningful.",
          },
          {
            title: "Handle stress and conflict",
            description:
              "Develop strategies to manage stress and resolve conflicts in a healthy and constructive manner.",
          },
          {
            title: "Strengthen relationships",
            description:
              "Build deeper connections by understanding and responding to the emotions of others, fostering trust and intimacy.",
          },
          {
            title: "Use insights in therapy or coaching",
            description:
              "Gain valuable insights into your emotional patterns and triggers, which can be used in therapy or coaching to support personal growth and healing.",
          },
        ]}
        bgImage={benefitsBg}
      />

      <WhySection />

      <InfoSection
        info={{
          duration: "6–10 min",
          questions: "50 questions",
          result: "Instant",
        }}
      />
    </main>
  );
}
