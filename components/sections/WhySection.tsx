import brain from "@/assets/icons/brain.svg";
import shift from "@/assets/icons/shift.svg";
import openAi from "@/assets/icons/light-chat-gpt-icon.svg";
import lamp from "@/assets/icons/lamp.svg";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import whyGridVector from "@/assets/why-graytest-bg.svg";

const features = [
  {
    icon: brain,
    title: "Grounded in psychology",
    description:
      "Every test is built on peer-reviewed frameworks — IQ, MSCEIT, Big Five, AQ.",
  },
  {
    icon: shift,
    title: "Adapts to you",
    description: "Questions shift in real time, matching the way you think.",
  },
  {
    icon: openAi,
    title: "AI + human insight",
    description:
      "Advanced AI analysis turns your answers into a clear, personal profile.",
  },
  {
    icon: lamp,
    title: "Results that matter",
    description: "Get honest, practical insights you can actually use.",
  },
];

type WhySectionProps = {
  isHomePage?: boolean;
};

export function WhySection({ isHomePage = false }: WhySectionProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-25 px-6 md:px-12 lg:px-39">
      {!isHomePage && (
        <div className="absolute inset-0 z-[-1]">
          <Image
            src={whyGridVector}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-center font-light text-white mb-10 md:mb-16 lg:mb-21">
          Why Graytest?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="relative w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-black/35 to-gray-200/5 from-5% to-95% backdrop-blur-[1.5px] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.2)]">
                <div className="absolute inset-0 rounded-full shadow-[inset_-1px_-1px_0px_rgba(255,255,255,0.5)] pointer-events-none" />
                <Image
                  src={feature.icon}
                  alt=""
                  width={28}
                  height={28}
                  className="relative z-10 md:w-[30px] md:h-[30px]"
                />
              </div>
              <h3 className="font-serif text-lg md:text-xl text-[#D4D4D4] mb-3 md:mb-[1.25">
                {feature.title}
              </h3>
              <p className="text-sm text-[#A1A1A1]">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-24 lg:mt-35">
          <Button asChild>
            <Link href="/test/iq" className="block mx-auto">
              Take A Test
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
