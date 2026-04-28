import { Hero } from "@/components/sections/Hero";
import { MeasuresSection } from "@/components/sections/test/MeasuresSection";
import { BenefitsSection } from "@/components/sections/test/BenefitsSection";
import { WhySection } from "@/components/sections/WhySection";
import { InfoSection } from "@/components/sections/test/InfoSection";
import bgImage from "@/assets/eq-bg.svg";
import benefitsBg from "@/assets/eq-benefit.jpg";

export default function Page() {
  return (
    <main>
      <Hero
        title="Emotional Quotient (EQ)"
        description="Emotional intelligence gives you tools to navigate daily life with more balance and clarity."
        buttonText="Start your assessment"
        href="/test/eq/questions"
        videoSrc="/videos/eq.mp4"
        bgImage={bgImage}
        videoClassName="right-8 lg:right-39 rounded-[344px] border border-white/10 w-2/5 aspect-9/7 object-cover"
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
              "Understand your triggers and use techniques to stay calm, recover quickly, and avoid escalating small issues into big ones.",
          },
          {
            title: "Strengthen relationships",
            description:
              "Empathy helps you connect deeply, resolve misunderstandings, and build stronger trust in both personal and professional circles.",
          },
          {
            title: "Use insights in therapy or coaching",
            description:
              "Bring your EQ profile to a professional to work on specific goals, like managing anger, increasing resilience, or building leadership skills.",
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
