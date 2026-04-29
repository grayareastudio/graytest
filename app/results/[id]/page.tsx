// app/results/[id]/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  DimensionBreakdown,
  getResultById,
} from "@/lib/actions/result-actions";
import { getScoringQuestions } from "@/lib/actions/test-actions";
import { Button } from "@/components/ui/Button";
import { BenefitsSection } from "@/components/sections/test/BenefitsSection";
import Image from "next/image";
import geometricMind from "@/assets/result/geometric-mind.jpg";
import warningIcon from "@/assets/icons/warning.svg";
import bgImage from "@/assets/grid-vector-2.svg";
import benefitsBg from "@/assets/iq-benefit.png";
import trisullaIcon from "@/assets/icons/trisulla.svg";
import noteIcon from "@/assets/icons/note.svg";
import messageIcon from "@/assets/icons/message.svg";
import dollarIcon from "@/assets/icons/dollar.svg";
import ctaBg from "@/assets/result/cta-background.png";
import icebergBg from "@/assets/result/iceberg.png";
import { ResultsAnalysis } from "@/components/results/ResultsAnalysis";
import { PricingTiers } from "@/components/results/PricingTiers";

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
      "Your results reveal a mind built for pattern and precision.",
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
        desc: "Language is not just how you communicate — it's how you think. Your ability to extract meaning, detect nuance, and reason through complex verbal information is exceptionally high. This reflects both comprehension depth and the kind of sharp analytical reading that turns words into leverage. You likely process arguments faster than most people can form them.",
      },
      {
        category: "Pattern Recognition",
        title: "Pattern Recognition",
        desc: "You operate comfortably beyond the literal. When faced with unfamiliar structures or novel frameworks, you adapt — finding rules that aren't written anywhere. This score signals a powerful capacity for non-verbal logic: the ability to see relationships between ideas that exist outside of language or prior experience. It's the foundation of systems thinking.",
      },
      {
        category: "Verbal Ability",
        title: "Linguistic Intelligence",
        desc: "You don't just reach conclusions — you construct them. Your ability to move from principles to outcomes with precision places you in the top tier of logical thinkers. Where others guess, you build a case. This score reflects a mind that finds structure in complexity and arrives at truth through disciplined inference.",
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
      <main className="min-h-screen flex flex-col items-center justify-center text-white px-6">
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
  const dimensionMetadata = safeJsonParse<
    Record<string, { badge: string; category: string }>
  >(result.dimension_metadata, {});
  const dimensionBreakdown =
    safeJsonParse<DimensionBreakdown[]>(
      result.dimension_breakdown,
      content.breakdown,
    ) || content.breakdown;
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
    stats = {
      correct: `${correctCount}`,
      wrong: `${result.total_questions - correctCount}`,
      accuracy: `${Math.round((correctCount / result.total_questions) * 100)}%`,
    };
  }

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

  return (
    <main className="min-h-screen flex flex-col text-white">
      <Header />
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-12 lg:px-39">
        <Image
          src={bgImage}
          alt=""
          fill
          sizes="(max-width: 2000px) 100vw, (max-width: 1024px) 75vw, 50vw"
          className="-z-1 object-cover"
          priority
        />
        <div className="mx-auto">
          <div className="flex justify-between gap-52">
            <div className="max-w-114">
              <span className="text-2xl text-white/50 block mb-6">
                IQ-style Assessment
              </span>
              <h1 className="font-serif text-[4rem] text-white mb-4">
                Your IQ Score
              </h1>
              <p className="text-2xl text-white mb-16">
                Based on your answers, our AI has generated your GrayPrint.
              </p>

              {/* Share & Download Buttons */}
              <div className="flex gap-8 mb-16">
                <Button size="md">Share Results</Button>
                <Button size="md" variant="outline">
                  Download Results PDF
                </Button>
              </div>

              {/* Score Display */}
              <div className="flex gap-4 mb-12">
                <div className="font-serif text-9xl text-white">
                  {result.score}
                </div>
                <div>
                  <div className="text-2xl text-white mb-5">
                    Percentile Ranking
                  </div>
                  <div className="font-serif text-[4rem] text-white">
                    {result.percentile}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full">
              <Image
                src={geometricMind}
                alt="hero"
                fill
                className="object-cover"
              />
              <div className="w-4/5 absolute -bottom-37 left-1/2 -translate-x-1/2 bg-black/58 backdrop-blur-sm border border-white/10 rounded-md px-10 py-5">
                <span className="font-serif text-2xl text-[#A1A1A1] mb-4">
                  Your Graytest profile
                </span>
                <h2 className="font-serif text-[4rem] text-white mb-2">
                  {artisticTitle}
                </h2>
                <p className="text-white mb-4">{artisticDescription}</p>
                <Button size="md">Learn More</Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-28 mt-30">
            <div className="flex-1 bg-black/58 border border-white/10 rounded-2xl p-10">
              <h3 className="text-2xl font-light uppercase tracking-wider text-[#A1A1A1] mb-6">
                Dimension Breakdown
              </h3>
              <div className="space-y-6">
                {traits.map((trait) => {
                  const meta = dimensionMetadata[trait.name];
                  return (
                    <div key={trait.name} className="flex items-center gap-10">
                      <div className="w-32 text-white font-light shrink-0">
                        {trait.name}
                      </div>
                      <div className="flex-1 h-2 border border-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D9D9D9] rounded-full border border-white"
                          style={{
                            width: `${Math.min(100, Math.max(0, trait.value))}%`,
                          }}
                        />
                      </div>
                      <div className="w-12 text-right text-sm text-[#D4D4D4]">
                        {trait.value}/100
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1  bg-[#0A0A0A]/40 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-5 mb-6">
                <Image src={warningIcon} alt="warning" width={64} height={64} />
                <h3 className="text-2xl text-white">
                  An <span className="font-bold">assessment fee</span> is
                  required for our deep report
                </h3>
              </div>
              <p className="font-light text-white">
                Finding out deeper information regarding your strengths and
                weaknesses requires an extra processing power which is supported
                by this fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ResultsAnalysis
        traits={traits}
        dimensionMetadata={dimensionMetadata}
        breakdowns={dimensionBreakdown}
      />

      {/* Iceberg Premium Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="mx-auto">
          <div className="px-6 md:px-12 lg:px-39">
            <h2 className="font-serif text-[4rem] text-white mb-6">
              Just the tip of the Iceberg
            </h2>
            <p className="text-white text-2xl mb-16 max-w-xl">
              What you saw is just the surface of how you think. Go deeper to
              uncover{" "}
              <span className="text-white font-bold">
                how to make it work for you.
              </span>
            </p>
          </div>

          <div className="relative w-full aspect-4/3 mx-auto">
            {/* Iceberg Image */}
            <Image
              src={icebergBg}
              alt="Iceberg visualization"
              fill
              className="object-contain"
              priority
            />

            {/* IQ Score */}
            <div className="absolute top-[15%] left-[35%] md:top-[12%] md:left-[38%] lg:top-[10%] lg:left-[40%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-10 py-5 text-2xl text-white whitespace-nowrap shadow-lg">
                IQ Score
              </div>
            </div>

            {/* Result Analysis */}
            <div className="absolute top-[15%] right-[20%] md:top-[12%] md:right-[22%] lg:top-[10%] lg:right-[25%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-10 py-5 text-2xl text-white whitespace-nowrap shadow-lg">
                Result Analysis
              </div>
            </div>

            {/* Dimension Breakdown */}
            <div className="absolute top-[20%] left-[10%] md:top-[18%] md:left-[12%] lg:top-[15%] lg:left-[15%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-10 py-5 text-2xl text-white whitespace-nowrap shadow-lg">
                Dimension Breakdown
              </div>
            </div>

            {/* Below Water Labels (Deeper Insights) */}

            {/* Environment Design */}
            <div className="absolute top-[45%] left-[50%] -translate-x-1/2 md:top-[42%] lg:top-[40%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-10 py-5 text-2xl text-white whitespace-nowrap shadow-lg">
                Environment Design (noise, structure, autonomy)
              </div>
            </div>

            {/* Relationship Compatibility */}
            <div className="absolute top-[55%] left-[15%] md:top-[52%] md:left-[18%] lg:top-[50%] lg:left-[20%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-10 py-5 text-2xl text-white whitespace-nowrap shadow-lg">
                Relationship Compatibility
              </div>
            </div>

            {/* Career Matching */}
            <div className="absolute top-[65%] left-[40%] md:top-[62%] md:left-[42%] lg:top-[60%] lg:left-[43%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-10 py-5 text-2xl text-white whitespace-nowrap shadow-lg">
                Career Matching
              </div>
            </div>

            {/* Learning Style Optimization */}
            <div className="absolute top-[58%] right-[22%] md:top-[55%] md:right-[24%] lg:top-[52%] lg:right-[26%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-10 py-5 text-2xl text-white whitespace-nowrap shadow-lg">
                Learning style optimization
              </div>
            </div>

            {/* Daily Operating System */}
            <div className="absolute bottom-[20%] left-[18%] md:bottom-[22%] md:left-[20%] lg:bottom-[24%] lg:left-[22%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-10 py-5 text-2xl text-white whitespace-nowrap shadow-lg">
                Daily operating system
              </div>
            </div>

            {/* Detailed GrayTest Profile */}
            <div className="absolute bottom-[25%] right-[12%] md:bottom-[27%] md:right-[14%] lg:bottom-[28%] lg:right-[16%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-10 py-5 text-2xl text-white whitespace-nowrap shadow-lg">
                Detailed GrayTest Profile
              </div>
            </div>
          </div>
        </div>
      </section>

      <PricingTiers testType={testKey} className="mb-16" />

      {/* Benefits Section */}
      <BenefitsSection
        items={[
          {
            title: "Discover your strongest skills",
            description:
              "Find out if logic, math, language, or memory are your standout strengths—and put them to work in study, career, or problem-solving.",
          },
          {
            title: "Handle stress and conflict",
            description:
              "Understand your triggers and use techniques to stay calm, recover quickly, and avoid escalating small issues into big ones.",
          },
          {
            title: "Strengthen relationships",
            description:
              "Empathy helps you connect deeply, resolve misunderstandings, and build stronger trust in both personal and professional circles.",
          },
          {
            title: "Use insights in therapy or coaching",
            description:
              "Bring your EQ profile to a professional to work on specific goals, like managing anger, increasing resilience, or building leadership skills.",
          },
        ]}
        bgImage={benefitsBg}
        href="dashboard"
      />

      {/* Professional Consultation Section */}
      <section className="relative py-24 px-6 md:px-12 lg:px-39">
        <Image
          src={ctaBg}
          fill
          alt="background"
          className="object-cover -z-10 opacity-20"
        />

        <div className="mx-auto">
          <h2 className="font-serif text-5xl leading-normal text-white mb-10 max-w-xl">
            Want to go deeper with a licensed professional?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <p className="col-span-2 text-[#D1D5DC] max-w-3xl">
              Graytest gives you AI-powered insights. But having a human
              perspective makes all the difference. If your results spark
              curiosity, raise concerns, or open new questions—you don't have to
              explore them alone.
            </p>

            <ul className="space-y-6 text-sm font-semibold max-w-xl">
              <li className="flex items-center gap-7">
                <div className="w-12 h-12 rounded-full bg-[#525252] flex items-center justify-center shrink-0">
                  <Image src={trisullaIcon} alt="icon" width={48} height={48} />
                </div>
                <p className="text-[#D4D4D4]">
                  Meet with a licensed psychologist
                </p>
              </li>
              <li className="flex items-center gap-7">
                <div className="w-12 h-12 rounded-full bg-[#525252] flex items-center justify-center shrink-0">
                  <Image src={noteIcon} alt="icon" width={48} height={48} />
                </div>
                <p className="text-[#D4D4D4]">
                  Get a personalized assessment roadmap
                </p>
              </li>
              <li className="flex items-center gap-7">
                <div className="w-12 h-12 rounded-full bg-[#525252] flex items-center justify-center shrink-0">
                  <Image src={messageIcon} alt="icon" width={48} height={48} />
                </div>
                <p className="text-[#D4D4D4]">
                  Explore ADHD, Autism, or executive function concerns with
                  guidance
                </p>
              </li>
              <li className="flex items-center gap-7">
                <div className="w-12 h-12 rounded-full bg-[#525252] flex items-center justify-center shrink-0">
                  <Image src={dollarIcon} alt="icon" width={48} height={48} />
                </div>
                <p className="text-[#D4D4D4]">
                  Professional evaluations often cost $3–5K — we help start that
                  journey at a fraction of the price
                </p>
              </li>
            </ul>

            <div className="relative backdrop-blur-sm bg-[#171717]/50 shadow-[inset_5px_5px_5px_0px_rgba(0,0,0,0.2),inset_-5px_-5px_5px_0px_rgba(255,255,255,0.04)] border border-white/15 rounded-2xl p-6 w-53 h-max">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-white font-semibold bg-[#0A0A0A]/20 border border-white px-2 py-1 rounded-full backdrop-blur-[10px] z-10">
                Coming Soon
              </span>
              <h3 className="text-white mb-4">Psych consultation</h3>
              <div className="font-serif text-[2rem] text-white mb-8">$150</div>
              <ul className="space-y-4 text-[#A1A1A1]">
                <li>• Professional review</li>
                <li>• Diagnostic report</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {content.showDisclaimer && (
        <section className="px-6 md:px-12 lg:px-39 pb-16">
          <div className="mx-auto bg-[#0A0A0A]/40 border border-[#c6bcaa]/20 rounded-2xl p-6">
            <p className="text-sm text-[#A1A1A1] leading-relaxed">
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
