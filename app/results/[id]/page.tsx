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
import { ShareButton } from "@/components/results/ShareButton";

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

      <section className="relative pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-24 px-4 md:px-8 lg:px-39">
        <Image
          src={bgImage}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
          className="-z-10 object-cover"
          priority
        />
        <div className="mx-auto">
          {/* Top Section: Text + Image */}
          <div className="flex flex-col xl:flex-row justify-between gap-8 lg:gap-16 xl:gap-52">
            {/* Left Column */}
            <div className="max-w-full xl:max-w-114">
              <span className="text-lg md:text-xl lg:text-2xl text-white/50 block mb-4 md:mb-6">
                IQ-style Assessment
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-[4rem] text-white mb-3 md:mb-4 leading-tight">
                Your IQ Score
              </h1>
              <p className="text-base md:text-lg lg:text-2xl text-white mb-8 lg:mb-16">
                Based on your answers, our AI has generated your GrayPrint.
              </p>

              {/* Share & Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-16">
                <ShareButton
                  title="My GrayTest Result"
                  text="Check out my personality assessment results"
                  url={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                />
                <Button
                  size="md"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Download Results PDF
                </Button>
              </div>

              {/* Score Display */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 lg:mb-12">
                <div className="font-serif text-5xl md:text-7xl lg:text-9xl text-white leading-none">
                  {result.score}
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-4 md:pl-6">
                  <div className="text-base md:text-xl text-white/80 mb-1 md:mb-2">
                    Percentile Ranking
                  </div>
                  <div className="font-serif text-2xl md:text-3xl lg:text-[4rem] text-white leading-none">
                    {result.percentile}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Image + Overlay Card */}
            <div className="relative w-full aspect-4/3 xl:aspect-auto xl:h-auto min-h-[280px] xl:min-h-0">
              <Image
                src={geometricMind}
                alt="hero"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute -bottom-30 w-4/5 left-1/2 -translate-x-1/2 bg-black/58 backdrop-blur-sm border border-white/10 rounded-md px-4 py-4 lg:px-10 lg:py-5">
                <span className="font-serif text-base lg:text-2xl text-[#A1A1A1] mb-2 lg:mb-4 block">
                  Your Graytest profile
                </span>
                <h2 className="font-serif text-xl md:text-2xl lg:text-[3rem] text-white mb-1 lg:mb-2 leading-tight">
                  {artisticTitle}
                </h2>
                <p className="text-sm md:text-base text-white/90 mb-3 lg:mb-4 line-clamp-2 lg:line-clamp-none">
                  {artisticDescription}
                </p>
                <Button size="sm" className="w-full sm:w-auto lg:size-md">
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section: Dimension Breakdown + Fee Card */}
          <div className="flex flex-col xl:flex-row items-center gap-6 xl:gap-10 mt-40">
            {/* Breakdown Card */}
            <div className="flex-1 bg-black/58 border border-white/10 rounded-2xl p-5 md:p-8 lg:p-10">
              <h3 className="text-base md:text-lg lg:text-2xl font-light uppercase tracking-wider text-[#A1A1A1] mb-4 md:mb-6">
                Dimension Breakdown
              </h3>
              <div className="space-y-4 md:space-y-5 lg:space-y-6">
                {traits.map((trait) => (
                  <div
                    key={trait.name}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-10"
                  >
                    <div className="w-full sm:w-32 text-white font-light text-sm md:text-base shrink-0">
                      {trait.name}
                    </div>
                    <div className="flex-1 h-1.5 md:h-2 border border-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D9D9D9] rounded-full border border-white transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(0, trait.value))}%`,
                        }}
                      />
                    </div>
                    <div className="w-full sm:w-12 text-right text-xs md:text-sm text-[#D4D4D4]">
                      {trait.value}/100
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Card */}
            <div className="flex-1 bg-[#0A0A0A]/40 border border-white/10 rounded-2xl p-5 md:p-6 lg:p-6 flex flex-col justify-center">
              <div className="flex items-start gap-3 md:gap-4 lg:gap-5 mb-3 md:mb-4 lg:mb-6">
                <Image
                  src={warningIcon}
                  alt="warning"
                  width={64}
                  height={64}
                  className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 shrink-0"
                />
                <h3 className="text-base md:text-lg lg:text-2xl text-white leading-snug">
                  An <span className="font-bold">assessment fee</span> is
                  required for our deep report
                </h3>
              </div>
              <p className="font-light text-white text-sm md:text-base leading-relaxed">
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
      <section className="py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="mx-auto">
          <div className="px-4 md:px-12 lg:px-39 mb-8 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[4rem] text-white mb-3 md:mb-6">
              Just the tip of the Iceberg
            </h2>
            <p className="text-white text-base md:text-xl lg:text-2xl max-w-xl leading-relaxed">
              What you saw is just the surface of how you think. Go deeper to
              uncover{" "}
              <span className="text-white font-bold">
                how to make it work for you.
              </span>
            </p>
          </div>

          <div className="relative w-full aspect-4/5 mx-auto">
            {/* Iceberg Image */}
            <Image
              src={icebergBg}
              alt="Iceberg visualization"
              fill
              className="object-cover"
              priority
            />

            {/* IQ Score */}
            <div className="absolute top-[10%] left-[20%] md:top-[14%] md:left-[36%] lg:top-[10%] lg:left-[20%] xl:top-[10%] xl:left-[35%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl lg:rounded-2xl px-3 py-1.5 md:px-6 md:py-3 lg:px-10 lg:py-5 text-[10px] md:text-base lg:text-2xl text-white whitespace-nowrap shadow-lg">
                IQ Score
              </div>
            </div>

            {/* Result Analysis */}
            <div className="absolute top-[10%] right-[15%] md:top-[14%] md:right-[20%] lg:top-[10%] lg:right-[25%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl lg:rounded-2xl px-3 py-1.5 md:px-6 md:py-3 lg:px-10 lg:py-5 text-[10px] md:text-base lg:text-2xl text-white whitespace-nowrap shadow-lg">
                Result Analysis
              </div>
            </div>

            {/* Dimension Breakdown */}
            <div className="absolute top-[20%] left-[15%] md:top-[18%] md:left-[10%] lg:top-[20%] lg:left-[15%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl lg:rounded-2xl px-3 py-1.5 md:px-6 md:py-3 lg:px-10 lg:py-5 text-[10px] md:text-base lg:text-2xl text-white whitespace-nowrap shadow-lg">
                Dimension Breakdown
              </div>
            </div>

            {/* Below Water Labels */}

            {/* Environment Design */}
            <div className="absolute top-[35%] left-[25%] md:top-[42%] md:left-[45%] lg:top-[40%] lg:left-[50%] lg:-translate-x-1/2">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl lg:rounded-2xl px-3 py-1.5 md:px-6 md:py-3 lg:px-10 lg:py-5 text-[10px] md:text-base lg:text-2xl text-white whitespace-nowrap shadow-lg text-center">
                <span className="hidden md:inline">
                  Environment Design (noise, structure, autonomy)
                </span>
                <span className="md:hidden">Environment Design</span>
              </div>
            </div>

            {/* Relationship Compatibility */}
            <div className="absolute top-[45%] left-[15%] md:top-[52%] md:left-[18%] lg:top-[50%] lg:left-[10%] xl:top-[50%] xl:left-[20%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl lg:rounded-2xl px-3 py-1.5 md:px-6 md:py-3 lg:px-10 lg:py-5 text-[10px] md:text-base lg:text-2xl text-white whitespace-nowrap shadow-lg">
                <span className="hidden md:inline">
                  Relationship Compatibility
                </span>
                <span className="md:hidden">Relationships</span>
              </div>
            </div>

            {/* Career Matching */}
            <div className="absolute top-[55%] left-[25%] md:top-[62%] md:left-[42%] lg:top-[60%] lg:left-[43%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl lg:rounded-2xl px-3 py-1.5 md:px-6 md:py-3 lg:px-10 lg:py-5 text-[10px] md:text-base lg:text-2xl text-white whitespace-nowrap shadow-lg">
                Career Matching
              </div>
            </div>

            {/* Learning Style Optimization */}
            <div className="absolute top-[48%] right-[15%] md:top-[55%] md:right-[24%] lg:top-[52%] lg:right-[10%] xl:top-[52%] xl:right-[26%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl lg:rounded-2xl px-3 py-1.5 md:px-6 md:py-3 lg:px-10 lg:py-5 text-[10px] md:text-base lg:text-2xl text-white whitespace-nowrap shadow-lg">
                <span className="hidden md:inline">
                  Learning style optimization
                </span>
                <span className="md:hidden">Learning Style</span>
              </div>
            </div>

            {/* Daily Operating System */}
            <div className="absolute bottom-[20%] left-[20%] md:bottom-[22%] md:left-[20%] lg:bottom-[24%] lg:left-[22%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl lg:rounded-2xl px-3 py-1.5 md:px-6 md:py-3 lg:px-10 lg:py-5 text-[10px] md:text-base lg:text-2xl text-white whitespace-nowrap shadow-lg">
                <span className="hidden md:inline">Daily operating system</span>
                <span className="md:hidden">Daily OS</span>
              </div>
            </div>

            {/* Detailed GrayTest Profile */}
            <div className="absolute bottom-[25%] right-[20%] md:bottom-[27%] md:right-[14%] lg:bottom-[28%] lg:right-[10%] xl:bottom-[28%] xl:right-[16%]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl lg:rounded-2xl px-3 py-1.5 md:px-6 md:py-3 lg:px-10 lg:py-5 text-[10px] md:text-base lg:text-2xl text-white whitespace-nowrap shadow-lg">
                <span className="hidden lg:inline">
                  Detailed GrayTest Profile
                </span>
                <span className="lg:hidden">Detailed Profile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PricingTiers testType={testKey} className="mb-12 md:mb-16" />

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
      <section className="relative py-16 md:py-24 px-4 md:px-8 lg:px-39">
        <Image
          src={ctaBg}
          fill
          alt="background"
          className="object-cover -z-10 opacity-20"
        />

        <div className="mx-auto">
          {/* Title */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-white mb-6 md:mb-8 lg:mb-10 max-w-3xl">
            Want to go deeper with a licensed professional?
          </h2>

          {/* Description - full width on all screens */}
          <p className="text-[#D1D5DC] text-sm md:text-base max-w-3xl mb-10 md:mb-12 lg:mb-16">
            Graytest gives you AI-powered insights. But having a human
            perspective makes all the difference. If your results spark
            curiosity, raise concerns, or open new questions—you don't have to
            explore them alone.
          </p>

          {/* Content Grid: Mobile = stacked, Desktop = 2-column */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
            {/* Left Column: Feature List */}
            <div className="flex-1 w-full lg:max-w-xl">
              <ul className="space-y-5 md:space-y-6">
                {[
                  {
                    icon: trisullaIcon,
                    text: "Meet with a licensed psychologist",
                  },
                  {
                    icon: noteIcon,
                    text: "Get a personalized assessment roadmap",
                  },
                  {
                    icon: messageIcon,
                    text: "Explore ADHD, Autism, or executive function concerns with guidance",
                  },
                  {
                    icon: dollarIcon,
                    text: "Professional evaluations often cost $3–5K — we help start that journey at a fraction of the price",
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#525252] flex items-center justify-center shrink-0 mt-0.5">
                      <Image
                        src={item.icon}
                        alt=""
                        width={48}
                        height={48}
                        className="w-6 h-6 md:w-7 md:h-7"
                      />
                    </div>
                    <p className="text-[#D4D4D4] text-sm md:text-base leading-relaxed pt-0.5">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Pricing Card */}
            <div className="w-full lg:w-auto lg:min-w-[280px]">
              <div className="relative backdrop-blur-sm bg-[#171717]/50 shadow-[inset_5px_5px_5px_0px_rgba(0,0,0,0.2),inset_-5px_-5px_5px_0px_rgba(255,255,255,0.04)] border border-white/15 rounded-2xl p-6 mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-white font-semibold bg-[#0A0A0A]/20 border border-white px-2.5 py-1 rounded-full backdrop-blur-[10px] z-10 whitespace-nowrap">
                  Coming Soon
                </span>

                <h3 className="text-white mb-4 text-lg md:text-xl font-medium">
                  Psych consultation
                </h3>

                <div className="font-serif text-3xl md:text-[2.5rem] text-white mb-6">
                  $150
                </div>

                <ul className="space-y-3 text-[#A1A1A1] text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9D9D9]"></span>
                    Professional review
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9D9D9]"></span>
                    Diagnostic report
                  </li>
                </ul>

                <Button className="w-full mt-6" size="md" variant="outline">
                  Notify When Available
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {content.showDisclaimer && (
        <section className="px-4 md:px-8 lg:px-39 pb-12 md:pb-16">
          <div className="mx-auto bg-[#0A0A0A]/40 border border-[#c6bcaa]/20 rounded-2xl p-4 md:p-6">
            <p className="text-xs md:text-sm text-[#A1A1A1] leading-relaxed">
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
