"use client";

import Image from "next/image";
import gridVector from "@/assets/grid-vector.svg";

interface Measure {
  title: string;
  description: string;
}

interface MeasuresSectionProps {
  items: Measure[];
}

export function MeasuresSection({ items }: MeasuresSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-30 lg:py-50">
      <div className="absolute inset-0 z-0">
        <Image
          src={gridVector}
          alt="Grid"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto flex flex-col items-center px-6 md:px-12 lg:px-39">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#efece7] mb-10 md:mb-12 lg:mb-15 text-center">
          What This Test Measures
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 w-full">
          {items.map((item, index) => (
            <div
              key={index}
              className="
                px-5 py-4 md:px-6 md:py-5 lg:px-7 lg:py-5 rounded-xl 
                bg-[#171717]/50
                transition-all duration-300
              "
            >
              <h3 className="font-serif text-lg md:text-xl text-[#D4D4D4] mb-3 md:mb-4.5">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-[#A1A1A1] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
