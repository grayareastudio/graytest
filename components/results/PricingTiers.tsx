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
    <section className="relative px-4 md:px-8 lg:px-39">
      {/* Header & Preview Section */}
      <div className="relative lg:absolute lg:-top-110 lg:left-39 lg:right-39 flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-start lg:items-center mb-12 lg:mb-24 mx-auto max-w-5xl lg:max-w-none">
        <div className="w-full lg:w-auto px-2 lg:px-0">
          <p className="text-white text-lg md:text-xl lg:text-2xl mb-2">
            Beyond the basic
          </p>

          <h2 className="font-serif text-2xl md:text-[2rem] lg:text-[2.5rem] text-white mb-6 md:mb-8 lg:mb-11 leading-tight">
            Your <span className="text-[#FBBC05]">Premium</span> GrayPrint
            <br className="hidden sm:inline" />
            is waiting to be read.
          </h2>

          <p className="text-white text-sm md:text-base lg:text-xl max-w-lg">
            Your score is just the surface. The full report maps the programming
            of your mind — and how to use it.
          </p>
        </div>

        <div className="relative rounded-2xl md:rounded-3xl lg:rounded-4xl border border-white/10 bg-white/5 backdrop-blur-md p-4 md:p-6 lg:p-10 flex items-center justify-center min-h-[240px] md:min-h-[280px] lg:min-h-80 overflow-hidden w-full mx-auto">
          {/* Blurred fake content */}
          <div className="absolute inset-0 blur-sm text-[#636363] text-xs md:text-lg lg:text-2xl p-3 md:p-4 lg:p-6 bg-black leading-relaxed">
            <div className="flex gap-4 md:gap-6 lg:gap-10 w-full mb-3 md:mb-4">
              <h2 className="whitespace-nowrap font-medium">
                Complete results
              </h2>
              <div className="w-full bg-[#1D1A10] h-3 md:h-4 lg:h-5 rounded"></div>
            </div>
            <div className="flex gap-4 md:gap-6 lg:gap-10 w-full mb-3 md:mb-4">
              <h2 className="whitespace-nowrap font-medium">Life Choices</h2>
              <div className="w-full bg-[#1D1A10] h-3 md:h-4 lg:h-5 rounded"></div>
            </div>
            <p className="line-clamp-2 md:line-clamp-none">
              Your score is just the surface. The full report maps the
              programming of your mind - and how to use it.
            </p>
            <div className="hidden md:block mt-4 space-y-1 text-xs opacity-70">
              <p>• Complete results breakdown...</p>
              <p>• Career matching recommendations...</p>
              <p>• Learning style optimization...</p>
            </div>
          </div>

          {/* Lock overlay */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-[130px] lg:h-[130px] rounded-xl md:rounded-2xl bg-black/40 border border-white flex items-center justify-center mb-2 md:mb-3 lg:mb-4.5 backdrop-blur-sm">
              <Image
                src={lockIcon}
                width={90}
                height={90}
                alt="Locked content"
                className="opacity-80 w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20"
              />
            </div>
            <p className="text-white text-sm md:text-base lg:text-xl">
              Unlock to review full breakdown
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 lg:gap-18 mx-auto ${className || ""}`}
      >
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`
            bg-[#0A0A0A]/40 border rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 pb-10 md:pb-14 lg:pb-16 relative
            ${tier.highlighted ? "border-2 border-[#FCE194]" : "border-white/10"}
          `}
          >
            {tier.badge && (
              <div className="absolute -top-3 md:-top-5 lg:-top-8 left-1/2 -translate-x-1/2 px-4 md:px-6 lg:px-10 py-1.5 md:py-2 lg:py-2.5 border border-[#FBBC05] text-[#FFD353] text-xs md:text-sm font-semibold rounded-xl md:rounded-2xl whitespace-nowrap backdrop-blur-sm">
                {tier.badge}
              </div>
            )}

            <div className="text-sm md:text-lg lg:text-2xl text-white/50 mb-2 md:mb-4">
              {tier.description}
            </div>
            <h3 className="font-serif text-xl md:text-[1.75rem] lg:text-[2rem] text-white mb-2 md:mb-4">
              {tier.name}
            </h3>
            <div className="font-serif text-3xl md:text-[3rem] lg:text-[4rem] text-white mb-4 md:mb-6 lg:mb-8">
              {tier.price}
            </div>

            <ul className="space-y-4 md:space-y-5 lg:space-y-7 text-sm md:text-base lg:text-xl text-[#A1A1A1]">
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
