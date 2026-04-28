// components/intro/SlideRenderer.tsx
"use client";

import type {
  IntroSlideData,
  DimensionCardData,
} from "@/lib/data/intro-slides";

interface SlideRendererProps {
  slide: IntroSlideData;
}

function DimensionCard({ title, description }: DimensionCardData) {
  return (
    <div>
      <h3 className="text-white font-bold mb-2.5 text-2xl">{title}</h3>
      <p className="text-white leading-loose">{description}</p>
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const parts = para.split(/(\*\*.*?\*\*)/g).filter(Boolean);

        return (
          <p key={pIdx} className="mb-4 last:mb-0">
            {parts.map((part, i) => {
              if (
                part.startsWith("**") &&
                part.endsWith("**") &&
                part.length > 4
              ) {
                return (
                  <strong key={i} className="font-bold">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return (
                <span key={i} className="font-light">
                  {part}
                </span>
              );
            })}
          </p>
        );
      })}
    </>
  );
}

export function SlideRenderer({ slide }: SlideRendererProps) {
  return (
    <div className="w-full">
      <div className="text-2xl text-white mb-6">
        <FormattedText text={slide.description} />
      </div>

      {slide.type === "text" && (
        <div className="text-white italic space-y-4">
          <FormattedText text={slide.content as string} />
        </div>
      )}

      {slide.type === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {(slide.content as DimensionCardData[]).map((card, i) => (
            <DimensionCard key={i} {...card} />
          ))}
        </div>
      )}

      {slide.type === "info" && (
        <div className="text-white">
          <FormattedText text={slide.content as string} />
        </div>
      )}
    </div>
  );
}
