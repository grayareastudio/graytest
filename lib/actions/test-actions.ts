"use server";

import { createClient } from "@supabase/supabase-js";
import { type Question, type ScoringQuestion } from "@/lib/test/questions";
import { calculateScore } from "@/lib/scoring";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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
    visualOptions: q.options || [],
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
  const { data: data, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      question_type,
      text,
      options,
      rows,
      main_image,
      sort_order
    `,
    )
    .eq("test_type", testType)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(error.message);
  }

  return (data || []).map(mapToQuestion);
}

export async function submitTestResults(
  testType: string,
  answers: Record<number, any>,
  totalQuestions: number,
  durationSeconds?: number,
) {
  const { data: questions, error: fetchError } = await supabase
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
      reverse_scored
    `,
    )
    .eq("test_type", testType)
    .eq("is_active", true);

  if (fetchError) throw new Error(fetchError.message);

  const scoringQuestions = (questions || []).map(mapToScoringQuestion);

  const scoringResult = calculateScore(testType, answers, scoringQuestions);

  const { data: result, error: insertError } = await supabase
    .from("test_results")
    .insert({
      test_type: testType,
      total_questions: totalQuestions,
      answers: answers,
      score: scoringResult.score,
      percentile: scoringResult.percentile,
      tag: scoringResult.tag,
      dimension_scores: scoringResult.dimension_scores,
      duration_seconds: durationSeconds,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);
  return result;
}
