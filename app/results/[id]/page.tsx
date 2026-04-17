// app/results/[id]/page.tsx
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fake data Phase 1
  const fakeResult = {
    id,
    testType: "IQ Assessment",
    score: 128,
    percentile: "91st",
    tag: "High Average",
    correct: 8,
    wrong: 2,
    accuracy: 80,
    traits: [
      { name: "Logical Reasoning", value: 92 },
      { name: "Pattern Recognition", value: 85 },
      { name: "Verbal Ability", value: 78 },
      { name: "Processing Speed", value: 88 },
    ],
    breakdown: [
      {
        category: "Logical",
        score: 92,
        title: "Deductive Reasoning",
        desc: "You excel at drawing valid conclusions from premises.",
      },
      {
        category: "Visual",
        score: 85,
        title: "Pattern Recognition",
        desc: "Your ability to identify structures in visual sequences is strong.",
      },
      {
        category: "Verbal",
        score: 78,
        title: "Linguistic Intelligence",
        desc: "Strong vocabulary underpins your ability to communicate complex ideas.",
      },
    ],
    aiInsight:
      "Your GrayPrint reveals a mind that thrives on structure and logic. You process information methodically, preferring to analyze patterns before drawing conclusions.",
  };

  return (
    <main className="min-h-full flex flex-col bg-linear-to-tr from-black to-[#171717] text-white">
      {/* Sticky Nav - Matching your floating pill nav */}
      <nav className="fixed top-14 left-39 right-39 z-40 flex items-center justify-between px-10 h-16 transition-all duration-400 backdrop-blur-[20px] border border-white/10 rounded-full bg-[#0A0A0A]/20">
        <Link href="/" className="font-serif text-xl uppercase text-[#D4D4D4]">
          GrayPrint
        </Link>
        <div className="flex gap-4">
          <button className="rounded-full font-semibold transition-all duration-200 hover:cursor-pointer bg-[#E5E5E5]/20 border border-white/10 text-white px-6 py-2 text-sm">
            Email
          </button>
          <button className="rounded-full font-semibold transition-all duration-200 hover:cursor-pointer bg-[#E5E5E5]/20 border border-white/10 text-white px-6 py-2 text-sm">
            Share
          </button>
        </div>
      </nav>

      {/* Hero / Score Section */}
      <section className="py-25 px-39 pt-40">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-5 h-px bg-[#D4D4D4]/50" />
            <span className="text-[10px] tracking-[0.28em] uppercase text-[#D4D4D4] opacity-75">
              {fakeResult.testType}
            </span>
          </div>

          <h1 className="font-serif text-5xl text-white mb-4">
            Your {fakeResult.testType.split(" ")[0]} Score
          </h1>
          <p className="text-2xl text-[#D4D4D4] font-light max-w-xl mb-21">
            Based on your answers, our AI has generated your GrayPrint with
            actionable insights.
          </p>

          <div className="grid grid-cols-4 gap-10 mb-21">
            <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:-translate-y-1 transition-transform">
              <div className="font-serif text-5xl text-white mb-2">
                {fakeResult.score}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                Total Score
              </div>
            </div>
            <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:-translate-y-1 transition-transform">
              <div className="font-serif text-5xl text-white mb-2">
                {fakeResult.correct}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                Correct
              </div>
            </div>
            <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:-translate-y-1 transition-transform">
              <div className="font-serif text-5xl text-white mb-2">
                {fakeResult.wrong}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                Wrong
              </div>
            </div>
            <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:-translate-y-1 transition-transform">
              <div className="font-serif text-5xl text-white mb-2">
                {fakeResult.accuracy}%
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                Accuracy
              </div>
            </div>
          </div>

          {/* Percentile & Tag */}
          <div className="flex items-end justify-between mb-21">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#A1A1A1] mb-2">
                Percentile ranking
              </div>
              <div className="font-serif text-3xl text-white">
                {fakeResult.percentile}
              </div>
            </div>
            <span className="text-sm font-semibold text-white bg-[#0A0A0A]/20 border border-white px-4 py-1.5 rounded-full backdrop-blur-[10px]">
              {fakeResult.tag}
            </span>
          </div>

          {/* Traits Bars */}
          <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-10 space-y-8">
            <h3 className="font-serif text-3xl text-white">
              Dimension breakdown
            </h3>
            <div className="space-y-6">
              {fakeResult.traits.map((trait) => (
                <div key={trait.name} className="flex items-center gap-6">
                  <div className="text-xl text-[#D4D4D4] w-44 shrink-0">
                    {trait.name}
                  </div>
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D4D4D4] transition-all duration-700"
                      style={{ width: `${trait.value}%` }}
                    />
                  </div>
                  <div className="font-serif text-xl text-white w-12 text-right">
                    {trait.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-25 px-39 bg-black">
        <div className="mx-auto">
          <h2 className="font-serif text-5xl text-center font-light text-white mb-21">
            Detailed analysis
          </h2>

          <div className="grid grid-cols-3 gap-10">
            {fakeResult.breakdown.map((item) => (
              <div
                key={item.category}
                className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-10 hover:-translate-y-1 transition-transform"
              >
                <div className="font-serif text-5xl text-white leading-none mb-6">
                  {item.score}
                </div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#A1A1A1] mb-6">
                  {item.category}
                </div>
                <h3 className="font-serif text-2xl text-[#D4D4D4] mb-4">
                  {item.title}
                </h3>
                <p className="text-base text-[#A1A1A1] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Insight */}
      <section className="py-25 px-39">
        <div className="mx-auto bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-10 flex items-start gap-6">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-[#D4D4D4]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <span className="text-xs tracking-[0.22em] uppercase text-[#D4D4D4] opacity-70 block mb-4">
              AI Insight
            </span>
            <p className="text-xl text-[#D4D4D4] font-light leading-relaxed">
              {fakeResult.aiInsight}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
