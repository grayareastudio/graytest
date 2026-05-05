"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { INTRO_SLIDES_DATA } from "@/lib/data/intro-slides";
import { SlideRenderer } from "@/components/intro/SlideRenderer";
import { Button } from "@/components/ui/Button";
import GradientText from "@/components/ui/GradientText";
import Image from "next/image";
import deleteIcon from "@/assets/icons/delete.svg";

export default function TestIntroPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const params = useParams();
  const testType = params.type as string;

  const slides =
    INTRO_SLIDES_DATA[testType as keyof typeof INTRO_SLIDES_DATA] ||
    INTRO_SLIDES_DATA.iq;

  const current = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.push(`/test/${testType}/questions`);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    window.history.back()
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 lg:px-39 py-10 md:py-20 w-full">
      <button
      onClick={handleClose}
        className="text-white/70 hover:text-white transition-colors hover:cursor-pointer absolute top-10 right-10"
      >
        <Image src={deleteIcon} alt="close" width={36} height={36} />
      </button>

      <h1 className="font-serif text-4xl md:text-5xl mb-8 text-center max-w-4xl">
        <GradientText>{current.title}</GradientText>
      </h1>

      <div className="flex gap-2 mb-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-[#D9D9D9]"
                : "bg-[#D9D9D9] opacity-50 hover:opacity-100"
            }`}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl mb-12 animate-fadeIn">
        <SlideRenderer slide={current} />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-12">
        <Button
          variant="primary"
          onClick={handlePrevious}
          disabled={currentSlide === 0}
        >
          Previous
        </Button>
        <Button
          variant={isLastSlide ? "secondary" : "primary"}
          onClick={handleNext}
        >
          {isLastSlide ? "Start" : "Next"}
        </Button>
      </div>
    </div>
  );
}
