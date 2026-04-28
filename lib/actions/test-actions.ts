// lib/actions/test-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { type Question, type ScoringQuestion } from "@/lib/test/questions";
import { calculateScore } from "@/lib/scoring";
import { generateGrayPrintAI, type AIInsightPayload } from "./ai-actions";
import { getCurrentUser } from "./auth-actions";
import { sendTestResultEmail } from "./email-actions";
import { DimensionBreakdown } from "./result-actions";

function mapQuestionType(dbType: string): Question["type"] {
  switch (dbType) {
    case "pattern":
    case "multiple":
    case "likert_5":
    case "likert_4":
      return "radio";
    case "matrix":
      return "matrix";
    case "visual":
      return "visual";
    case "open":
      return "open";
    case "checkbox":
      return "checkbox";
    default:
      return "radio";
  }
}

function mapToQuestion(q: any): Question {
  return {
    id: q.id,
    type: mapQuestionType(q.question_type),
    text: q.text,
    options: q.options || [],
    rows: q.rows || [],
    mainImage: q.main_image,
  };
}

function mapToScoringQuestion(q: any): ScoringQuestion {
  return {
    ...mapToQuestion(q),
    correct_answer: q.correct_answer,
    dimension: q.dimension,
    spectrum_dimension: q.spectrum_dimension,
    reverse_scored: q.reverse_scored,
  };
}

export async function getTestQuestions(testType: string): Promise<Question[]> {
  const supabase = await createClient();
  const { data: data, error } = await supabase
    .from("questions")
    .select("id, question_type, text, options, rows, main_image, sort_order")
    .eq("test_type", testType)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapToQuestion);
}

function generateDimensionMetadata(
  testType: string,
  dimensionScores: Record<string, number>,
): Record<string, { badge: string; category: string }> {
  const badgeMapping: Record<string, string> = {
    "Logical Reasoning": "Local",
    "Pattern Recognition": "Visual",
    "Verbal Ability": "Dimensional",
    "Processing Speed": "Local",
    "Self-Awareness": "Emotional",
    "Self-Regulation": "Emotional",
    Empathy: "Social",
    "Social Skills": "Social",
    Openness: "Dimensional",
    Conscientiousness: "Local",
    Extraversion: "Social",
    Agreeableness: "Social",
    Neuroticism: "Emotional",
    "Attention Switching": "Cognitive",
    "Attention to Detail": "Cognitive",
    Imagination: "Dimensional",
  };

  const metadata: Record<string, { badge: string; category: string }> = {};

  Object.entries(dimensionScores).forEach(([name, score]) => {
    let badge: string;
    if (score >= 90) badge = "Gold Standard";
    else if (score >= 75) badge = "Hidden Potential";
    else if (score >= 50) badge = "Developing";
    else badge = "Needs Attention";

    metadata[name] = {
      badge,
      category: badgeMapping[name] || "Local",
    };
  });

  return metadata;
}

function generateDimensionBreakdown(
  testType: string,
  scores: Record<string, number>,
): DimensionBreakdown[] {
  // Contoh logic sederhana: Pilih judul/deskripsi berdasarkan skor tinggi/rendah
  const templates: Record<
    string,
    {
      high: { title: string; desc: string };
      low: { title: string; desc: string };
    }
  > = {
    "Logical Reasoning": {
      high: {
        title: "Deductive Reasoning",
        desc: "You excel at drawing valid conclusions from premises — a foundation for analytical thinking.",
      },
      low: {
        title: "Developing Logic",
        desc: "You are building your deductive skills. Practice with structured arguments to strengthen this area.",
      },
    },
    "Pattern Recognition": {
      high: {
        title: "Pattern Mastery",
        desc: "Your ability to identify recurring structures in visual sequences is exceptional.",
      },
      low: {
        title: "Pattern Awareness",
        desc: "You are developing your eye for patterns. Try exercises with sequences to improve.",
      },
    },
    "Verbal Ability": {
      high: {
        title: "Linguistic Intelligence",
        desc: "Strong vocabulary underpins your ability to communicate complex ideas.",
      },
      low: {
        title: "Language Skills",
        desc: "Focus on expanding vocabulary and reading comprehension to boost this score.",
      },
    },
    "Processing Speed": {
      high: {
        title: "Rapid Processing",
        desc: "You process simple visual information with high accuracy under time pressure.",
      },
      low: {
        title: "Steady Processing",
        desc: "Accuracy is key. Try to balance speed and precision in future exercises.",
      },
    },
    // Default fallback
    default: {
      high: {
        title: "Strong Performance",
        desc: "You demonstrated strong capabilities in this area.",
      },
      low: {
        title: "Potential to Grow",
        desc: "With focused practice, you can significantly improve in this area.",
      },
    },
  };

  return Object.entries(scores).map(([name, score]) => {
    const template = templates[name] || templates.default;
    const isHigh = score >= 70; // Threshold score tinggi
    const content = isHigh ? template.high : template.low;

    return {
      category: name,
      title: content.title,
      desc: content.desc,
    };
  });
}

export async function submitTestResults(
  testType: string,
  answers: Record<number, any>,
  totalQuestions: number,
  durationSeconds?: number,
  userEmail?: string,
) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data: questions, error: fetchError } = await supabase
    .from("questions")
    .select(
      "id, question_type, text, options, rows, main_image, correct_answer, dimension, spectrum_dimension, reverse_scored",
    )
    .eq("test_type", testType)
    .eq("is_active", true);

  if (fetchError) throw new Error(fetchError.message);

  const scoringQuestions = (questions || []).map(mapToScoringQuestion);
  const scoringResult = calculateScore(testType, answers, scoringQuestions);

  let aiContent: AIInsightPayload | null = null;
  try {
    aiContent = await generateGrayPrintAI(
      testType,
      scoringResult.score,
      scoringResult.percentile,
      scoringResult.tag,
      scoringResult.dimension_scores || {},
    );
  } catch (err) {
    console.warn("AI generation skipped:", err);
  }

  const { data: result, error: insertError } = await supabase
    .from("test_results")
    .insert({
      test_type: testType,
      total_questions: scoringQuestions.length,
      answers: answers,
      score: scoringResult.score,
      percentile: scoringResult.percentile,
      tag: scoringResult.tag,
      dimension_scores: scoringResult.dimension_scores,
      dimension_metadata: generateDimensionMetadata(
        testType,
        scoringResult.dimension_scores || {},
      ),
      dimension_breakdown: generateDimensionBreakdown(
        testType,
        scoringResult.dimension_scores || {},
      ),
      duration_seconds: durationSeconds,
      completed_at: new Date().toISOString(),
      user_id: user?.id || null,
      ai_artistic_title: aiContent?.artisticTitle,
      ai_artistic_description: aiContent?.artisticDescription,
      ai_insights: aiContent?.insights,
      ai_recommendations: aiContent?.recommendations,
    })
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);

  if (userEmail && result?.id) {
    sendTestResultEmail({
      to: userEmail,
      testType,
      score: scoringResult.score,
      percentile: scoringResult.percentile,
      tag: scoringResult.tag,
      resultId: result.id,
      artisticTitle: aiContent?.artisticTitle,
      artisticDescription: aiContent?.artisticDescription,
    }).catch((err) => console.warn("Email delivery failed:", err));
  }

  return result;
}

export async function getScoringQuestions(
  testType: string,
): Promise<ScoringQuestion[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      question_type,
      text,
      options,
      rows,
      main_image,
      correct_answer,
      dimension,
      spectrum_dimension,
      reverse_scored,
      sort_order
    `,
    )
    .eq("test_type", testType)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);

  return (data || []).map(mapToScoringQuestion);
}
