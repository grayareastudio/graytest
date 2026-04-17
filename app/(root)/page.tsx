import { Hero } from "@/components/sections/Hero";
import { GrayPrintSection } from "@/components/sections/GrayPrintSection";
import { TestCards } from "@/components/sections/TestCards";
import { WhySection } from "@/components/sections/WhySection";
import Image from "next/image";
import heroImage from "@/assets/hero-image.jpg";
import bgVector2 from "@/assets/bg-vector-2.svg";

export default function HomePage() {
  return (
    <main>
      <Hero
        title="F"
        description="Achieve clarity though the world's first AI-powered cognitive testing platform."
        buttonText="Take a Test"
        image={heroImage}
      />
      <GrayPrintSection />
      <div className="relative">
        <div className="absolute inset-0 h-225 top-130 -z-10">
          <Image src={bgVector2} alt="divider" fill className="object-cover" />
        </div>
        <TestCards />
        <WhySection />
      </div>
    </main>
  );
}
