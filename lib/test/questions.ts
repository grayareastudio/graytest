// lib/test/questions.ts

export type QuestionType = "radio" | "checkbox" | "matrix" | "open" | "visual";

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: { id: string; label: string }[];
  rows?: { id: string; question: string }[];
  mainImage?: string;
  visualOptions?: { id: string; imageUrl: string }[];
}

export interface ScoringQuestion extends Question {
  correct_answer?: string;
  dimension?: "O" | "C" | "E" | "A" | "N";
  spectrum_dimension?:
    | "social_skills"
    | "attention_switching"
    | "attention_to_detail"
    | "imagination";
  reverse_scored?: boolean;
  difficulty?: number;
}

export interface TestConfig {
  duration: number;
  questions: Question[];
}

export const TEST_CONFIG: Record<string, TestConfig> = {
  iq: {
    duration: 1200, // 20 minutes
    questions: [],
  },
};

export function getTestConfig(type: string): TestConfig {
  return TEST_CONFIG[type] || TEST_CONFIG.iq;
}
