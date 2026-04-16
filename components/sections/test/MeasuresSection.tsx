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
    <section className="relative py-50 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={gridVector} alt="Grid" fill />
      </div>

      <div className="relative z-10 mx-auto flex flex-col items-center px-39">
        <h2 className="font-serif text-5xl text-[#efece7] mb-15">
          What This Test Measures
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
          {items.map((item, index) => (
            <div
              key={index}
              className="
                px-7 py-5 rounded-xl 
                bg-[#171717]/50
                transition-all duration-300
              "
            >
              <h3 className="font-serif text-xl text-[#D4D4D4] mb-4.5">
                {item.title}
              </h3>
              <p className="text-sm text-[#A1A1A1]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
