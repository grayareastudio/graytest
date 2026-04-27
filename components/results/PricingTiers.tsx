"use client";

import lockIcon from "@/assets/icons/lock.svg";
import Image from "next/image";

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaText: string;
}

const PRICING_MOCK: Record<string, PricingTier[]> = {
  iq: [
    {
      id: "basic",
      name: "Basic",
      description: "Free",
      price: "$0",
      features: [
        "IQ Score + Percentile",
        "4-dimension overview",
        "GrayTest profile type",
        "Shareable result card",
      ],
      ctaText: "Get Started",
    },
    {
      id: "full",
      name: "Full Grayprint",
      description: "Most Popular",
      price: "$29",
      features: [
        "Full cognitive breakdown",
        "Career growth strategy",
        "Graytest Profile analysis",
        "Learning style guide",
        "Relationship compatibility",
      ],
      highlighted: true,
      badge: "Most Popular",
      ctaText: "Unlock Full Report",
    },
    {
      id: "optimization",
      name: "Optimization Plan",
      description: "Premium",
      price: "$99",
      features: [
        "Everything in Full Grayprint",
        "Personalized action plan",
        "3-month progress tracking",
        "Priority email support",
        "Quarterly review session",
      ],
      ctaText: "Get Optimization Plan",
    },
  ],
  default: [
    {
      id: "basic",
      name: "Basic Results",
      description: "Free",
      price: "$0",
      features: ["Score overview", "Basic insights", "Shareable card"],
      ctaText: "Get Started",
    },
    {
      id: "full",
      name: "Full Report",
      description: "Most Popular",
      price: "$29",
      features: [
        "Detailed breakdown",
        "Actionable insights",
        "Career guidance",
        "Learning strategies",
      ],
      highlighted: true,
      badge: "Most Popular",
      ctaText: "Unlock Full Report",
    },
    {
      id: "premium",
      name: "Premium Plan",
      description: "Best Value",
      price: "$99",
      features: [
        "Everything in Full Report",
        "1-on-1 consultation",
        "Progress tracking",
        "Priority support",
      ],
      ctaText: "Get Premium",
    },
  ],
};

interface PricingTiersProps {
  testType: string;
  className?: string;
}

export function PricingTiers({ testType, className }: PricingTiersProps) {
  const tiers = PRICING_MOCK[testType] || PRICING_MOCK.default;

  return (
    <section className="relative px-6 md:px-12 lg:px-39">
      <div className="absolute -top-110 right-39 left-39 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <p className="text-white text-2xl mb-2">Beyond the basic</p>

          <h2 className="font-serif text-[2.5rem] text-white mb-11">
            Your <span className="text-[#FBBC05]">Premium</span> GrayPrint
            <br />
            is waiting to be read.
          </h2>

          <p className="text-white text-xl max-w-lg">
            Your score is just the surface. The full report maps the programming
            of your mind — and how to use it.
          </p>
        </div>

        <div className="relative rounded-4xl border border-white/10 bg-white/5 backdrop-blur-md p-10 flex items-center justify-center min-h-80 overflow-hidden w-full mx-auto">
          {/* Blurred fake content */}
          <div className="absolute inset-0 blur-sm text-[#636363] text-2xl p-6 bg-black leading-relaxed">
            <div className="flex gap-10 w-full">
              <h2 className="whitespace-nowrap">Complete results</h2>
              <div className="w-full bg-[#1D1A10] h-5"></div>
            </div>
            <div className="flex gap-10 w-full">
              <h2 className="whitespace-nowrap">Life Choices</h2>
              <div className="w-full bg-[#1D1A10] h-5"></div>
            </div>
            <p>
              Your score is just the surface. The full report maps the
              programming of your mind - and how to use it.
            </p>
            <br />
            <br />
            Complete results breakdown across all cognitive dimensions...
            <br />
            Life Choices optimization strategies...
            <br />
            Career matching recommendations...
            <br />
            Relationship compatibility analysis...
            <br />
            Learning style optimization guide...
            <br />
            Environment design suggestions...
            <br />
            Daily operating system framework...
          </div>

          {/* Lock overlay */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-32.5 h-32.5 rounded-2xl bg-black/40 border border-white flex items-center justify-center mb-4.5 backdrop-blur-sm">
              <Image
                src={lockIcon}
                width={90}
                height={90}
                alt="Locked content"
                className="opacity-80"
              />
            </div>
            <p className="text-white text-xl">
              Unlock to review full breakdown
            </p>
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-18 mx-auto ${className || ""}`}
      >
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`
            bg-[#0A0A0A]/40 border rounded-2xl p-8 pb-16 relative
            ${tier.highlighted ? "border-2 border-[#FCE194]" : "border-white/10"}
          `}
          >
            {tier.badge && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-10 py-2.5 border border-[#FBBC05] text-[#FFD353] font-semibold rounded-2xl whitespace-nowrap backdrop-blur-sm">
                {tier.badge}
              </div>
            )}

            <div className="text-2xl text-white/50 mb-4">
              {tier.description}
            </div>
            <h3 className="font-serif text-[2rem] text-white mb-4">
              {tier.name}
            </h3>
            <div className="font-serif text-[4rem] text-white mb-8">
              {tier.price}
            </div>

            <ul className="space-y-7 text-xl text-[#A1A1A1]">
              {tier.features.map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
