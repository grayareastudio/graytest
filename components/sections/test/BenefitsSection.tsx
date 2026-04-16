"use client";

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
    <section className="relative py-20 px-6 overflow-hidden">
      {bgImage && (
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="z-0"
          objectFit="cover"
        />
      )}
      <div className="relative z-10 px-39">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-60 items-center">
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-5xl md:text-6xl text-white mb-6 font-light tracking-tight">
                How it benefits you
              </h2>
              <p className=" text-[#D1D5DC]">
                Your cognitive profile is like a mental toolkit. Knowing what's
                inside helps you use it wisely.
              </p>
            </div>

            <button
              onClick={onCtaClick}
              className="
                px-8 py-4 rounded-full 
                bg-white/10 border border-white/20 
                text-white font-medium text-sm
                hover:bg-white/20 hover:border-white/30 
                transition-all duration-300
                backdrop-blur-sm
              "
            >
              Start your assessment
            </button>
          </div>

          {/* Right Accordion Panel */}
          <div className="bg-[#1D1D1D]/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
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
                      className="w-full flex items-center justify-between py-4 text-left group"
                    >
                      <span
                        className={`
                          font-serif text-2xl
                          transition-colors duration-300
                          ${isExpanded ? "text-white" : "text-[#ADADAD] group-hover:text-white"}
                        `}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`
                          w-6 h-6 flex items-center justify-center 
                          text-[#ADADAD] transition-all duration-300
                          ${isExpanded ? "rotate-45" : "rotate-0"}
                        `}
                      >
                        +
                      </span>
                    </button>

                    <div
                      className={`
                        overflow-hidden transition-all duration-500 ease-out
                        ${isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
                      `}
                    >
                      <p className="pb-7.5 text-white leading-relaxed">
                        {item.description}
                      </p>
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
