import { Hero } from "@/components/sections/Hero";
import { MeasuresSection } from "@/components/sections/test/MeasuresSection";
import { BenefitsSection } from "@/components/sections/test/BenefitsSection";
import { WhySection } from "@/components/sections/WhySection";
import { InfoSection } from "@/components/sections/test/InfoSection";
import bgImage from "@/assets/personality-bg.svg";
import benefitsBg from "@/assets/personality-benefit.png";
import Image from "next/image";

export default function Page() {
  return (
    <main>
      <Image
        src={bgImage}
        alt="bg"
        fill
        className="-z-1 object-cover rotate-180 top-0"
        priority
      />
      <Hero
        title="Personality Test"
        description="This test highlights your natural tendencies on how you act, think, and connect."
        buttonText="Start your assessment"
        href="/test/personality/questions"
        videoSrc="/videos/personality.mp4"
        bgImage={bgImage}
        videoClassName="right-8 lg:right-39 rounded-[50px] aspect-9.5/7 object-cover w-1/2"
      />

      <MeasuresSection
        items={[
          {
            title: "Openness to Experience:",
            description:
              "How curious, imaginative, and open to new ideas you are.",
          },
          {
            title: "Conscientiousness",
            description:
              "Your level of organization, discipline, and dependability.",
          },
          {
            title: "Extraversion",
            description: "How outgoing and sociable you are.",
          },
          {
            title: "Agreeableness",
            description:
              "How cooperative, empathetic, and trusting you are versus competitive or outspoken.",
          },
        ]}
      />

      <BenefitsSection
        items={[
          {
            title: "Increase self-awareness",
            description:
              "See your habits and tendencies clearly, so you can lean into your strengths and work on challenges without self-blame.",
          },
          {
            title: "Improve acceptance",
            description:
              "Realize that your style—whether organized, spontaneous, social, or reserved—is part of your natural wiring.",
          },
          {
            title: "Enhance teamwork and relationships",
            description:
              "Knowing your traits helps you collaborate better and empathize with people whose styles differ from yours.",
          },
          {
            title: "Align career and life choices",
            description:
              "Choose pathways that feel natural for your personality instead of forcing yourself into ill-fitting roles.",
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
