import { JSX } from "react";

interface ResultsAnalysisProps {
  traits: { name: string; value: number }[];
  dimensionMetadata: Record<string, { badge?: string; category?: string }>;
  breakdowns: { category: string; title: string; desc: string }[];
  className?: string;
}

export function ResultsAnalysis({
  traits,
  dimensionMetadata,
  breakdowns,
  className,
}: ResultsAnalysisProps): JSX.Element {
  return (
    <section
      className={`py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-39 ${className || ""}`}
    >
      <div className="mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-4xl uppercase text-white mb-6 md:mb-8">
          Results Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {traits.map((trait) => {
            const meta = dimensionMetadata[trait.name];
            const breakdown = breakdowns.find((b) => b.category === trait.name);

            return (
              <div
                key={trait.name}
                className="bg-[#171717]/50 shadow-[inset_5px_5px_5px_0px_rgba(0,0,0,0.2),inset_-5px_-5px_5px_0px_rgba(255,255,255,0.04)] transition-all duration-300 border border-white/15 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-0">
                  <div className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] text-white mb-1 sm:mb-4">
                    {trait.value}
                  </div>
                  {meta?.badge && (
                    <span
                      className={`px-3 py-1.5 md:px-6 md:py-2 lg:px-10 lg:py-2.5 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium uppercase tracking-wider border shrink-0 ${
                        meta.badge === "Gold Standard"
                          ? "border-[#FBBC05] text-[#FBBC05]"
                          : meta.badge === "Hidden Potential"
                            ? "border-[#4285F4] text-[#4285F4]"
                            : "border-white/20 text-[#A1A1A1]"
                      }`}
                    >
                      {meta.badge}
                    </span>
                  )}
                </div>

                {meta?.category && (
                  <div className="text-[10px] md:text-[9px] uppercase tracking-wider text-[#A1A1A1] mb-1.5 md:mb-2">
                    {meta.category}
                  </div>
                )}

                <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-white mb-3 md:mb-6 lg:mb-8">
                  {breakdown?.title || trait.name}
                </h3>
                <p className="text-sm md:text-base text-white font-light leading-relaxed">
                  {breakdown?.desc || "Analysis based on your responses."}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
