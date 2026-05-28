// lib/test/questions.ts

export type QuestionType = "radio" | "checkbox" | "matrix" | "open" | "visual" | "likert" | "likert_5" | "likert_4";

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: { id: string; label: string; imageUrl?: string }[];
  rows?: { id: string; question: string }[];
  mainImage?: string;
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
