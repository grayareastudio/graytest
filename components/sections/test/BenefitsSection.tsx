"use client";

import { Button } from "@/components/ui/Button";
import GradientText from "@/components/ui/GradientText";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { abortOnSynchronousPlatformIOAccess } from "next/dist/server/app-render/dynamic-rendering";

interface Benefit {
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  items: Benefit[];
  bgImage?: StaticImageData;
  href: string;
  description: string;
}

export function BenefitsSection({
  items,
  bgImage,
  href,
  description,
}: BenefitsSectionProps) {
  const url = usePathname()
  const eq = url === '/eq'

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-4 md:mb-6 font-light tracking-tight text-black/90 lg:text-white">
                How it benefits you
              </h2>
              <p className={`text-base md:text-lg text-black/80 lg:text-[#D1D5DC] max-w-xl mx-auto lg:mx-0 leading-relaxed ${eq ? 'bg-black' : ''}`}>
                {description}
              </p>
            </div>

            <Button>
              <Link href={href}>Start your assessment</Link>
            </Button>
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
                          text-2xl md:text-3xl
                          group-hover:text-white group-hover:scale-[110%]
                          ${isExpanded ? "text-white" : ""}
                          `}
                      >
                        {isExpanded ? "-" : "+"}
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
