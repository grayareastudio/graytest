"use client";

import GradientText from "@/components/ui/GradientText";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

interface Benefit {
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  items: Benefit[];
  bgImage?: StaticImageData;
  onCtaClick?: () => void;
}

export function BenefitsSection({
  items,
  bgImage,
  onCtaClick,
}: BenefitsSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <section className="relative py-16 md:py-20 lg:py-25 px-6 md:px-12 lg:px-39 overflow-hidden">
      {bgImage && (
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="z-0 object-cover"
          priority
        />
      )}

      <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-60 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-4 md:mb-6 font-light tracking-tight">
                <GradientText>How it benefits you</GradientText>
              </h2>
              <p className="text-base md:text-lg text-[#D1D5DC] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Your cognitive profile is like a mental toolkit. Knowing what's
                inside helps you use it wisely.
              </p>
            </div>

            <button
              onClick={onCtaClick}
              className="
                px-6 py-3 md:px-8 md:py-4 rounded-full 
                bg-white/10 border border-white/20 
                text-white font-medium text-sm
                hover:bg-white/20 hover:border-white/30 
                transition-all duration-300
                backdrop-blur-xs mx-auto lg:mx-0
              "
            >
              Start your assessment
            </button>
          </div>

          {/* Right Accordion Panel */}
          <div className="bg-[#1D1D1D]/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 md:p-6 lg:p-8 shadow-2xl">
            <div className="space-y-2">
              {items.map((item, index) => {
                const isExpanded = expandedIndex === index;

                return (
                  <div
                    key={index}
                    className={`
                      border-b border-white/10 last:border-b-0
                      ${index === 0 ? "pt-0" : "pt-2"}
                      pb-2
                    `}
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center justify-between py-3 md:py-4 text-left group"
                    >
                      <span
                        className={`
                          font-serif text-xl md:text-2xl
                          transition-colors duration-300
                          ${isExpanded ? "text-white" : "text-[#ADADAD] group-hover:text-white"}
                        `}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`
                          w-5 h-5 md:w-6 md:h-6 flex items-center justify-center 
                          text-[#ADADAD] transition-all duration-300
                          ${isExpanded ? "rotate-45" : "rotate-0"}
                        `}
                      >
                        +
                      </span>
                    </button>

                    <div
                      className={`
                        grid transition-[grid-template-rows] duration-500 ease-out
                        ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                      `}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-4 md:pb-7.5 text-sm md:text-base text-white leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
