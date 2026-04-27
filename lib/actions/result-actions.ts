// lib/actions/result-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export interface TestResult {
  id: string;
  test_type: string;
  total_questions: number;
  answers: Record<number, any>;
  score: number | null;
  percentile: string | null;
  tag: string | null;
  dimension_scores: Record<string, number> | null;
  duration_seconds: number | null;
  completed_at: string;
  user_id: string | null;
  ai_artistic_title: string | null;
  ai_artistic_description: string | null;
  ai_insights: string[] | null;
  ai_recommendations: string[] | null;
  dimension_metadata?: Record<string, { badge: string; category: string }>;
}

export async function getResultById(id: string): Promise<TestResult | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_results")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  if (!data) {
    console.warn(`No result found for ID: ${id}`);
    return null;
  }

  return data as TestResult;
}

export async function getUserTestHistory(
  userId?: string,
): Promise<TestResult[]> {
  const supabase = await createClient();

  let query = supabase
    .from("test_results")
    .select(
      "id, test_type, score, percentile, tag, completed_at, duration_seconds",
    )
    .order("completed_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch history:", error);
    return [];
  }

  return data as TestResult[];
}
