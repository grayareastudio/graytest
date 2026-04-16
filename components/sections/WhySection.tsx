"use client";
import brain from "@/assets/icons/brain.svg";
import shift from "@/assets/icons/shift.svg";
import openAi from "@/assets/icons/open-ai.png";
import lamp from "@/assets/icons/lamp.svg";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

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

export function WhySection() {
  return (
    <section className="py-25">
      <div className="mx-auto px-39">
        <h2 className="font-serif text-5xl text-center font-light text-white mb-21">
          Why Graytest?
        </h2>

        <div className="grid grid-cols-4 gap-10">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border border-white/10 rounded-full flex items-center justify-center">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={30}
                  height={30}
                />
              </div>
              <h3 className="font-serif text-xl text-[#D4D4D4] mb-4.5">
                {feature.title}
              </h3>
              <p className="text-sm text-[#A1A1A1]">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-35">
          <Button
            onClick={() =>
              document
                .getElementById("tests")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Take A Test
          </Button>
        </div>
      </div>
    </section>
  );
}
