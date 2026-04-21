// app/results/[id]/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getResultById } from "@/lib/actions/result-actions";
import { getScoringQuestions } from "@/lib/actions/test-actions";

const TEST_CONTENT: Record<
  string,
  {
    artisticTitle: string;
    artisticDescription: string;
    dimensions: { name: string }[];
    breakdown: {
      category: string;
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
        category: "Logical Reasoning",
        title: "Deductive Reasoning",
        desc: "You excel at drawing valid conclusions from premises — a foundation for analytical and creative problem solving.",
      },
      {
        category: "Pattern Recognition",
        title: "Pattern Recognition",
        desc: "Your ability to identify recurring structures in visual sequences is exceptional.",
      },
      {
        category: "Verbal Ability",
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
        category: "Self-Awareness",
        title: "Emotional Self-Awareness",
        desc: "You have a finely tuned ability to identify your emotions as they arise.",
      },
      {
        category: "Self-Regulation",
        title: "Impulse Regulation",
        desc: "You demonstrate strong capacity to pause before reacting in high-stakes situations.",
      },
      {
        category: "Empathy",
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
        title: "Intellectual Openness",
        desc: "You seek novelty in ideas — a hallmark of creative and philosophical thinkers.",
      },
      {
        category: "Conscientiousness",
        title: "Conscientious Drive",
        desc: "Your follow-through creates reliability that others instinctively trust.",
      },
      {
        category: "Extraversion",
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
        category: "Attention to Detail",
        title: "Exceptional Detail Orientation",
        desc: "You notice what others miss — precision underpins many of your strengths.",
      },
      {
        category: "Social Skills",
        title: "Social Processing Style",
        desc: "Your approach to social information is systematic and deeply considered.",
      },
      {
        category: "Attention Switching",
        title: "Cognitive Flexibility",
        desc: "Preference for routine is a cognitive style that powers deep focus and expertise.",
      },
    ],
    showDisclaimer: true,
  },
};

function getTestKey(testType: string): string {
  const normalized = testType.toLowerCase();
  if (normalized.includes("iq")) return "iq";
  if (normalized.includes("eq")) return "eq";
  if (normalized.includes("personality")) return "personality";
  if (normalized.includes("spectrum")) return "spectrum";
  return "iq";
}

function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return (value as T) ?? fallback;
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResultById(id);

  if (!result) {
    return (
      <main className="min-h-full flex flex-col items-center justify-center bg-linear-to-tr from-black to-[#171717] text-white px-6">
        <h1 className="font-serif text-3xl text-white mb-4">
          Result Not Found
        </h1>
        <p className="text-[#A1A1A1] mb-8">
          The test result you're looking for doesn't exist.
        </p>
        <a href="/" className="text-white underline">
          Back to Home
        </a>
      </main>
    );
  }

  const testKey = getTestKey(result.test_type);
  const content = TEST_CONTENT[testKey];
  const isIQ = testKey === "iq";

  const dimensionScores = safeJsonParse<Record<string, number>>(
    result.dimension_scores,
    {},
  );
  const aiInsights = safeJsonParse<string[]>(result.ai_insights, []);
  const aiRecommendations = safeJsonParse<string[]>(
    result.ai_recommendations,
    [],
  );

  let stats = { correct: "—", wrong: "—", accuracy: "N/A" };

  if (isIQ) {
    const questions = await getScoringQuestions(result.test_type);
    const answers = safeJsonParse<Record<number, string>>(result.answers, {});

    const correctCount = questions.filter(
      (q) => q.correct_answer && answers[q.id] === q.correct_answer,
    ).length;

    const wrongCount = result.total_questions - correctCount;
    const accuracy = Math.round((correctCount / result.total_questions) * 100);

    stats = {
      correct: `${correctCount}`,
      wrong: `${wrongCount}`,
      accuracy: `${accuracy}%`,
    };

    const traits =
      Object.entries(dimensionScores).length > 0
        ? Object.entries(dimensionScores).map(([name, value]) => ({
            name,
            value: typeof value === "number" ? value : 0,
          }))
        : content.dimensions.map((d) => ({ name: d.name, value: 0 }));

    const artisticTitle = result.ai_artistic_title || content.artisticTitle;
    const artisticDescription =
      result.ai_artistic_description || content.artisticDescription;
    const breakdownInsights =
      aiInsights.length > 0 ? aiInsights : content.breakdown.map((b) => b.desc);

    return (
      <main className="min-h-full flex flex-col bg-linear-to-tr from-black to-[#171717] text-white">
        <Header />

        {/* Hero Section */}
        <section className="pt-28 md:pt-36 lg:pt-40 pb-12 md:pb-16 lg:pb-20 px-6 md:px-12 lg:px-39">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 md:mb-12 lg:mb-16">
              <span className="text-[10px] tracking-[0.28em] uppercase text-[#c6bcaa] opacity-75 block mb-3">
                {result.test_type}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-3 md:mb-4 leading-tight">
                {artisticTitle}
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-[#D4D4D4] font-light leading-relaxed max-w-2xl">
                {artisticDescription}
              </p>
            </div>

            {/* Score Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12 lg:mb-16">
              {[
                { label: "Total Score", value: result.score ?? "—" },
                { label: "Correct", value: stats.correct },
                { label: "Wrong", value: stats.wrong },
                { label: "Accuracy", value: stats.accuracy },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 text-center hover:-translate-y-1 transition-transform"
                >
                  <div className="font-serif text-3xl md:text-4xl text-white mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Percentile & Tag */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12 lg:mb-16">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#A1A1A1] mb-1 md:mb-2">
                  Percentile ranking
                </div>
                <div className="font-serif text-2xl md:text-3xl text-white">
                  {result.percentile || "—"}
                </div>
              </div>
              <span className="text-sm font-semibold text-white bg-[#0A0A0A]/20 border border-white px-4 py-1.5 rounded-full backdrop-blur-[10px] self-start md:self-auto">
                {result.tag || "—"}
              </span>
            </div>

            {/* Traits Bars */}
            <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 space-y-5 md:space-y-6">
              <h3 className="font-serif text-xl md:text-2xl text-white mb-4 md:mb-6">
                Dimension breakdown
              </h3>
              <div className="space-y-4 md:space-y-5">
                {traits.map((trait) => (
                  <div
                    key={trait.name}
                    className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"
                  >
                    <div className="text-sm md:text-base text-[#D4D4D4] md:w-44 shrink-0">
                      {trait.name}
                    </div>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D9D9D9] transition-all duration-700"
                        style={{
                          width: `${Math.min(100, Math.max(0, trait.value))}%`,
                        }}
                      />
                    </div>
                    <div className="font-serif text-base md:text-lg text-white md:w-10 text-right">
                      {trait.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="py-16 md:py-20 lg:py-25 px-6 md:px-12 lg:px-39 bg-black">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-center font-light text-white mb-10 md:mb-12 lg:mb-16">
              Detailed analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {content.breakdown.map((item) => {
                const traitValue = traits.find(
                  (t) => t.name === item.category,
                )?.value;
                return (
                  <div
                    key={item.category}
                    className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:-translate-y-1 transition-transform"
                  >
                    <div className="font-serif text-3xl md:text-4xl text-white leading-none mb-3 md:mb-4">
                      {traitValue ?? "—"}
                    </div>
                    <div className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#A1A1A1] mb-3 md:mb-4">
                      {item.category}
                    </div>
                    <h3 className="font-serif text-lg md:text-xl text-[#D4D4D4] mb-2 md:mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#A1A1A1] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI Insight */}
        <section className="py-16 md:py-20 lg:py-25 px-6 md:px-12 lg:px-39">
          <div className="mx-auto max-w-7xl bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-[#D4D4D4]"
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
              <p className="text-base md:text-lg text-[#D4D4D4] font-light leading-relaxed mb-4">
                {artisticDescription}
              </p>
              <div className="space-y-3">
                {breakdownInsights.map((insight, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-[#A1A1A1]"
                  >
                    <span className="text-white mt-0.5">•</span> {insight}
                  </div>
                ))}
              </div>
              {aiRecommendations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-xs uppercase tracking-wider text-[#c6bcaa] mb-2 block">
                    Recommended Next Steps
                  </span>
                  {aiRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-[#A1A1A1] mb-1"
                    >
                      <span className="text-[#D4D4D4] mt-0.5">→</span> {rec}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Clinical Disclaimer */}
        {content.showDisclaimer && (
          <section className="px-6 md:px-12 lg:px-39 pb-12 md:pb-16">
            <div className="mx-auto max-w-7xl bg-[#0A0A0A]/20 backdrop-blur-md border border-[#c6bcaa]/20 rounded-2xl p-5 md:p-6">
              <p className="text-xs md:text-sm text-[#A1A1A1] leading-relaxed">
                <strong className="text-[#c6bcaa]">Disclaimer:</strong> The
                Spectrum Assessment is an educational self-awareness tool based
                on the validated AQ-50. It is not a clinical diagnosis and does
                not replace evaluation by a qualified mental health
                professional. If results raise questions, we encourage
                consulting a specialist.
              </p>
            </div>
          </section>
        )}

        <Footer />
      </main>
    );
  }
}
