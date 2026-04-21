// lib/actions/ai-actions.ts
"use server";

export interface AIInsightPayload {
  artisticTitle: string;
  artisticDescription: string;
  insights: string[];
  recommendations: string[];
}

function buildPrompt(
  testType: string,
  score: number,
  percentile: string,
  tag: string,
  dimensionScores: Record<string, number>,
): string {
  return `You are Graytest AI, a psychological assessment narrator.
Generate a personalized GrayPrint™ report based on these results:
- Test: ${testType.toUpperCase()}
- Overall Score: ${score}
- Percentile: ${percentile}
- Level: ${tag}
- Dimension Scores: ${JSON.stringify(dimensionScores)}

RULES:
1. Tone: Professional, insightful, empowering, strictly NON-CLINICAL.
2. Output: VALID JSON ONLY. No markdown, no extra text.
3. Structure:
{
  "artisticTitle": "3-5 words, metaphorical/poetic",
  "artisticDescription": "1-2 sentences, max 40 words, strengths-focused",
  "insights": ["Specific observation based on highest/lowest dimensions", "Second observation"],
  "recommendations": ["Practical next step for growth", "Second recommendation"]
}
4. NEVER mention diagnosis, disorder, medical terms, or clinical labels.`;
}

async function generateWithGemini(prompt: string): Promise<AIInsightPayload> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");

  const genAI = new GoogleGenerativeAI(apiKey);

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleanJson = text.replace(/```json\s*|\s*```/g, "").trim();
  return JSON.parse(cleanJson) as AIInsightPayload;
}

async function generateWithOpenAI(prompt: string): Promise<AIInsightPayload> {
  const OpenAI = await import("openai").then((m) => m.default);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const res = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You only output valid JSON. Follow the exact structure requested.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 350,
  });

  const content = res.choices[0]?.message?.content;
  if (!content) throw new Error("Empty OpenAI response");

  return JSON.parse(content) as AIInsightPayload;
}

export async function generateGrayPrintAI(
  testType: string,
  score: number,
  percentile: string,
  tag: string,
  dimensionScores: Record<string, number>,
): Promise<AIInsightPayload> {
  if (
    !process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
    !process.env.OPENAI_API_KEY
  ) {
    return getFallbackContent(testType);
  }

  const prompt = buildPrompt(testType, score, percentile, tag, dimensionScores);
  const provider = process.env.AI_PROVIDER || "gemini";

  try {
    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      return await generateWithOpenAI(prompt);
    }
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return await generateWithGemini(prompt);
    }
    return getFallbackContent(testType);
  } catch (error) {
    return getFallbackContent(testType);
  }
}

function getFallbackContent(testType: string): AIInsightPayload {
  const fallbacks: Record<string, AIInsightPayload> = {
    iq: {
      artisticTitle: "The Geometric Mind",
      artisticDescription:
        "Your results reveal a mind built for pattern and precision — one that finds structure where others see noise.",
      insights: ["Strong logical deduction", "Exceptional pattern recognition"],
      recommendations: [
        "Explore complex problem-solving frameworks",
        "Leverage analytical strengths in strategic planning",
      ],
    },
    eq: {
      artisticTitle: "The Empathic Current",
      artisticDescription:
        "Your emotional landscape is rich and layered — a deep reservoir of feeling that, when channeled, becomes your greatest strength.",
      insights: ["High emotional awareness", "Strong capacity for empathy"],
      recommendations: [
        "Practice mindful communication",
        "Use emotional insight to build deeper connections",
      ],
    },
    personality: {
      artisticTitle: "The Layered Self",
      artisticDescription:
        "Your personality profile reveals a multidimensional character — one that defies simple categorization. Welcome to the gray area.",
      insights: ["Balanced trait distribution", "Adaptable cognitive style"],
      recommendations: [
        "Leverage versatility in team environments",
        "Focus on roles matching your core strengths",
      ],
    },
    spectrum: {
      artisticTitle: "The Singular Lens",
      artisticDescription:
        "Your profile suggests a mind that sees the world with exceptional clarity and detail — patterns others walk past, you observe and remember.",
      insights: [
        "Exceptional attention to detail",
        "Systematic information processing",
      ],
      recommendations: [
        "Pursue deep-work or analytical fields",
        "Develop structured routines to maximize focus",
      ],
    },
  };
  return fallbacks[testType] || fallbacks.iq;
}
