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
      className={`py-16 md:py-24 px-6 md:px-12 lg:px-39 ${className || ""}`}
    >
      <div className="mx-auto">
        <h2 className="text-4xl uppercase text-white mb-8">Results Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {traits.map((trait) => {
            const meta = dimensionMetadata[trait.name];
            const breakdown = breakdowns.find((b) => b.category === trait.name);

            return (
              <div
                key={trait.name}
                className="bg-[#171717]/50 shadow-[inset_5px_5px_5px_0px_rgba(0,0,0,0.2),inset_-5px_-5px_5px_0px_rgba(255,255,255,0.04)] transition-all duration-300 border border-white/15 rounded-2xl p-6 md:p-8"
              >
                <div className="flex items-start justify-between">
                  <div className="font-serif text-[2.5rem] text-white mb-4">
                    {trait.value}
                  </div>
                  {meta?.badge && (
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-wider border ${
                        meta.badge === "Gold Standard"
                          ? "border-[#c6bcaa] text-[#c6bcaa]"
                          : meta.badge === "Hidden Potential"
                            ? "border-blue-400/50 text-blue-400"
                            : "border-white/20 text-[#A1A1A1]"
                      }`}
                    >
                      {meta.badge}
                    </span>
                  )}
                </div>

                {meta?.category && (
                  <div className="text-[9px] uppercase tracking-wider text-[#A1A1A1] mb-2">
                    {meta.category}
                  </div>
                )}

                <h3 className="font-serif text-2xl text-white mb-8">
                  {breakdown?.title || trait.name}
                </h3>
                <p className="text-white font-light">
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
