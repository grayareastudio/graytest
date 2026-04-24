import { Hero } from "@/components/sections/Hero";
import { GrayPrintSection } from "@/components/sections/GrayPrintSection";
import { TestCards } from "@/components/sections/TestCards";
import { WhySection } from "@/components/sections/WhySection";
import Image from "next/image";
import bgVector2 from "@/assets/bg-vector-2.svg";

export default function HomePage() {
  return (
    <main>
      <div className="bg-black">
        <Hero
          title="Find out how your brain actually works"
          description="Achieve clarity though the world's first AI-powered cognitive testing platform."
          buttonText="Take a Test"
          href="/test/iq"
          videoSrc="/videos/hero.mp4"
          videoClassName="right-8 lg:right-39 h-9/10"
        />
      </div>
      <GrayPrintSection />
      <div className="relative">
        <div className="absolute inset-0 h-225 top-130 -z-10">
          <div className="relative w-full h-225">
            <Image
              src={bgVector2}
              alt="bg vector"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <TestCards />
        <WhySection isHomePage={true} />
      </div>
    </main>
  );
}
