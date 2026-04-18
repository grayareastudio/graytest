// app/results/[id]/page.tsx
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

const TEST_CONTENT: Record<
  string,
  {
    artisticTitle: string;
    artisticDescription: string;
    dimensions: { name: string }[];
    breakdown: {
      category: string;
      score: number;
      title: string;
      desc: string;
    }[];
    showDisclaimer: boolean;
  }
> = {
  iq: {
    artisticTitle: "The Geometric Mind",
    artisticDescription:
      "Your results reveal a mind built for pattern and precision — one that finds structure where others see noise.",
    dimensions: [
      { name: "Logical Reasoning" },
      { name: "Pattern Recognition" },
      { name: "Verbal Ability" },
      { name: "Processing Speed" },
    ],
    breakdown: [
      {
        category: "Logical",
        score: 92,
        title: "Deductive Reasoning",
        desc: "You excel at drawing valid conclusions from premises — a foundation for analytical and creative problem solving.",
      },
      {
        category: "Visual",
        score: 85,
        title: "Pattern Recognition",
        desc: "Your ability to identify recurring structures in visual sequences is exceptional.",
      },
      {
        category: "Verbal",
        score: 78,
        title: "Linguistic Intelligence",
        desc: "Strong vocabulary underpins your ability to communicate complex ideas.",
      },
    ],
    showDisclaimer: false,
  },
  eq: {
    artisticTitle: "The Empathic Current",
    artisticDescription:
      "Your emotional landscape is rich and layered — a deep reservoir of feeling that, when channeled, becomes your greatest strength.",
    dimensions: [
      { name: "Self-Awareness" },
      { name: "Self-Regulation" },
      { name: "Empathy" },
      { name: "Social Skills" },
    ],
    breakdown: [
      {
        category: "Awareness",
        score: 88,
        title: "Emotional Self-Awareness",
        desc: "You have a finely tuned ability to identify your emotions as they arise.",
      },
      {
        category: "Regulation",
        score: 82,
        title: "Impulse Regulation",
        desc: "You demonstrate strong capacity to pause before reacting in high-stakes situations.",
      },
      {
        category: "Empathy",
        score: 90,
        title: "Empathic Accuracy",
        desc: "Reading others comes naturally — you pick up on subtle cues most people miss.",
      },
    ],
    showDisclaimer: false,
  },
  personality: {
    artisticTitle: "The Layered Self",
    artisticDescription:
      "Your personality profile reveals a multidimensional character — one that defies simple categorization. Welcome to the gray area.",
    dimensions: [
      { name: "Openness" },
      { name: "Conscientiousness" },
      { name: "Extraversion" },
      { name: "Agreeableness" },
      { name: "Neuroticism" },
    ],
    breakdown: [
      {
        category: "Openness",
        score: 85,
        title: "Intellectual Openness",
        desc: "You seek novelty in ideas — a hallmark of creative and philosophical thinkers.",
      },
      {
        category: "Conscientiousness",
        score: 78,
        title: "Conscientious Drive",
        desc: "Your follow-through creates reliability that others instinctively trust.",
      },
      {
        category: "Extraversion",
        score: 72,
        title: "Social Orientation",
        desc: "Your extraversion score reflects how you relate to others and draw energy.",
      },
    ],
    showDisclaimer: false,
  },
  spectrum: {
    artisticTitle: "The Singular Lens",
    artisticDescription:
      "Your profile suggests a mind that sees the world with exceptional clarity and detail — patterns others walk past, you observe and remember.",
    dimensions: [
      { name: "Social Skills" },
      { name: "Attention Switching" },
      { name: "Attention to Detail" },
      { name: "Imagination" },
    ],
    breakdown: [
      {
        category: "Detail",
        score: 88,
        title: "Exceptional Detail Orientation",
        desc: "You notice what others miss — precision underpins many of your strengths.",
      },
      {
        category: "Social",
        score: 65,
        title: "Social Processing Style",
        desc: "Your approach to social information is systematic and deeply considered.",
      },
      {
        category: "Flexibility",
        score: 70,
        title: "Cognitive Flexibility",
        desc: "Preference for routine is a cognitive style that powers deep focus and expertise.",
      },
    ],
    showDisclaimer: true,
  },
};

function getTestKey(testType: string): string {
  const map: Record<string, string> = {
    "IQ Assessment": "iq",
    "EQ Assessment": "eq",
    Personality: "personality",
    Spectrum: "spectrum",
  };
  return map[testType] || "iq";
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
  };

  const testKey = getTestKey(fakeResult.testType);
  const content = TEST_CONTENT[testKey];

  return (
    <main className="min-h-full flex flex-col bg-linear-to-tr from-black to-[#171717] text-white">
      {/* Sticky Nav */}
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
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.28em] uppercase text-[#c6bcaa] opacity-75 block mb-3">
              {fakeResult.testType}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
              {content.artisticTitle}
            </h1>
            <p className="text-xl text-[#D4D4D4] font-light leading-relaxed max-w-2xl">
              {content.artisticDescription}
            </p>
          </div>

          {/* Score Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
              <div className="font-serif text-4xl text-white mb-1">
                {fakeResult.score}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                Total Score
              </div>
            </div>
            <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
              <div className="font-serif text-4xl text-white mb-1">
                {fakeResult.correct}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                Correct
              </div>
            </div>
            <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
              <div className="font-serif text-4xl text-white mb-1">
                {fakeResult.wrong}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                Wrong
              </div>
            </div>
            <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
              <div className="font-serif text-4xl text-white mb-1">
                {fakeResult.accuracy}%
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                Accuracy
              </div>
            </div>
          </div>

          {/* Percentile & Tag */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#A1A1A1] mb-1">
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

          <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6">
            <h3 className="font-serif text-2xl text-white">
              Dimension breakdown
            </h3>
            <div className="space-y-4">
              {fakeResult.traits.map((trait) => (
                <div key={trait.name} className="flex items-center gap-4">
                  <div className="text-base text-[#D4D4D4] w-40 shrink-0">
                    {trait.name}
                  </div>
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D4D4D4] transition-all duration-700"
                      style={{ width: `${trait.value}%` }}
                    />
                  </div>
                  <div className="font-serif text-lg text-white w-10 text-right">
                    {trait.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Breakdown */}
      <section className="py-25 px-39 bg-black">
        <div className="mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-center font-light text-white mb-12">
            Detailed analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.breakdown.map((item) => (
              <div
                key={item.category}
                className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-8"
              >
                <div className="font-serif text-4xl text-white leading-none mb-4">
                  {item.score}
                </div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#A1A1A1] mb-4">
                  {item.category}
                </div>
                <h3 className="font-serif text-xl text-[#D4D4D4] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#A1A1A1] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Insight */}
      <section className="py-25 px-39">
        <div className="mx-auto bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-[#D4D4D4]"
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
            <span className="text-xs tracking-[0.22em] uppercase text-[#D4D4D4] opacity-70 block mb-3">
              AI Insight
            </span>
            <p className="text-base text-[#D4D4D4] font-light leading-relaxed">
              {content.artisticDescription}{" "}
            </p>
          </div>
        </div>
      </section>

      {content.showDisclaimer && (
        <section className="px-39 pb-12">
          <div className="mx-auto bg-[#0A0A0A]/20 backdrop-blur-md border border-[#c6bcaa]/20 rounded-2xl p-6">
            <p className="text-xs text-[#A1A1A1] leading-relaxed">
              <strong className="text-[#c6bcaa]">Disclaimer:</strong> The
              Spectrum Assessment is an educational self-awareness tool based on
              the validated AQ-50. It is not a clinical diagnosis and does not
              replace evaluation by a qualified mental health professional. If
              results raise questions, we encourage consulting a specialist.
            </p>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
