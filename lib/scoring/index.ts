import type { ScoringQuestion } from "@/lib/test/questions";

export interface ScoringResult {
  score: number;
  percentile: string;
  tag: string;
  dimension_scores: Record<string, number>;
}

export function calculateScore(
  testType: string,
  answers: Record<number, any>,
  questions: ScoringQuestion[],
): ScoringResult {
  switch (testType) {
    case "iq":
      return calculateIQScore(answers, questions);
    case "eq":
      return calculateEQScore(answers, questions);
    case "personality":
      return calculatePersonalityScore(answers, questions);
    case "spectrum":
      return calculateSpectrumScore(answers, questions);
    default:
      throw new Error(`Unknown test type: ${testType}`);
  }
}

function calculateIQScore(
  answers: Record<number, any>,
  questions: ScoringQuestion[],
): ScoringResult {
  let correct = 0;
  questions.forEach((q) => {
    if (q.correct_answer && answers[q.id] === q.correct_answer) correct++;
  });

  const total = questions.length;
  const baseScore = 85 + Math.round((correct / total) * 55);
  const randomBonus = Math.floor(Math.random() * 6);
  const score = Math.min(148, baseScore + randomBonus);

  let percentile: string, tag: string;
  if (score >= 130) {
    percentile = "98th";
    tag = "Superior";
  } else if (score >= 120) {
    percentile = "91st";
    tag = "High Average";
  } else if (score >= 110) {
    percentile = "75th";
    tag = "Above Average";
  } else {
    percentile = "50th";
    tag = "Average";
  }

  return { score, percentile, tag, dimension_scores: getIQDimensions(score) };
}

function calculateEQScore(
  answers: Record<number, any>,
  questions: ScoringQuestion[],
): ScoringResult {
  let sum = 0,
    count = 0;
  questions.forEach((q) => {
    const val = Number(answers[q.id]);
    if (!isNaN(val)) {
      sum += val;
      count++;
    }
  });

  const n = questions.length;
  const avg = count > 0 ? sum / count : 3;
  const randomBonus = Math.floor(Math.random() * 11);
  const score = Math.round(80 + (avg / 5) * 8 * n + randomBonus);

  let percentile: string, tag: string;
  if (score >= 115) {
    percentile = "88th";
    tag = "Exceptional";
  } else if (score >= 105) {
    percentile = "70th";
    tag = "High";
  } else {
    percentile = "52nd";
    tag = "Above Average";
  }

  return { score, percentile, tag, dimension_scores: getEQDimensions(score) };
}

function calculatePersonalityScore(
  answers: Record<number, any>,
  questions: ScoringQuestion[],
): ScoringResult {
  const dims = {
    O: "Openness",
    C: "Conscientiousness",
    E: "Extraversion",
    A: "Agreeableness",
    N: "Neuroticism",
  };
  const dimData: Record<string, { sum: number; count: number }> = {
    O: { sum: 0, count: 0 },
    C: { sum: 0, count: 0 },
    E: { sum: 0, count: 0 },
    A: { sum: 0, count: 0 },
    N: { sum: 0, count: 0 },
  };

  questions.forEach((q) => {
    if (q.dimension && dims[q.dimension as keyof typeof dims]) {
      const val = Number(answers[q.id]);
      if (!isNaN(val)) {
        dimData[q.dimension as keyof typeof dims].sum += val;
        dimData[q.dimension as keyof typeof dims].count++;
      }
    }
  });

  const dimension_scores: Record<string, number> = {};
  let totalSum = 0,
    totalCount = 0;

  Object.keys(dims).forEach((key) => {
    const { sum, count } = dimData[key as keyof typeof dims];
    const avg = count > 0 ? sum / count : 3;
    dimension_scores[dims[key as keyof typeof dims]] = Math.round(60 + avg * 8);
    totalSum += sum;
    totalCount += count;
  });

  const overallAvg = totalCount > 0 ? totalSum / totalCount : 3;
  const score = Math.round(60 + overallAvg * 8);

  let percentile: string, tag: string;
  if (score >= 140) {
    percentile = "95th";
    tag = "Very High";
  } else if (score >= 130) {
    percentile = "85th";
    tag = "High";
  } else if (score >= 120) {
    percentile = "70th";
    tag = "Above Average";
  } else if (score >= 110) {
    percentile = "55th";
    tag = "Average";
  } else {
    percentile = "40th";
    tag = "Below Average";
  }

  return { score, percentile, tag, dimension_scores };
}

function calculateSpectrumScore(
  answers: Record<number, any>,
  questions: ScoringQuestion[],
): ScoringResult {
  let sum = 0;
  questions.forEach((q) => {
    const val = Number(answers[q.id]);
    if (!isNaN(val)) sum += val;
  });

  const score = Math.round(sum * 1.2 + 8);

  let percentile: string, tag: string;
  if (score >= 32) {
    percentile = "90th";
    tag = "Elevated AQ";
  } else if (score >= 26) {
    percentile = "70th";
    tag = "Moderate AQ";
  } else {
    percentile = "50th";
    tag = "Typical Range";
  }

  return {
    score,
    percentile,
    tag,
    dimension_scores: getSpectrumDimensions(score),
  };
}

function getIQDimensions(score: number) {
  return {
    "Logical Reasoning": Math.round(score * 0.92),
    "Pattern Recognition": Math.round(score * 0.88),
    "Verbal Ability": Math.round(score * 0.82),
    "Processing Speed": Math.round(score * 0.9),
  };
}
function getEQDimensions(score: number) {
  return {
    "Self-Awareness": Math.round(score * 0.9),
    "Self-Regulation": Math.round(score * 0.88),
    Empathy: Math.round(score * 0.95),
    "Social Skills": Math.round(score * 0.92),
  };
}
function getSpectrumDimensions(score: number) {
  return {
    "Social Skills": Math.round(score * 0.85),
    "Attention Switching": Math.round(score * 0.88),
    "Attention to Detail": Math.round(score * 0.95),
    Imagination: Math.round(score * 0.82),
  };
}
