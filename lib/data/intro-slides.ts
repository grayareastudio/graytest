// lib/data/intro-slides.ts

export interface DimensionCardData {
  title: string;
  description: string;
}

export interface IntroSlideData {
  title: string;
  description: string;
  type: "text" | "grid" | "info";
  content: string | DimensionCardData[];
}

export const INTRO_SLIDES_DATA: Record<string, IntroSlideData[]> = {
  iq: [
    {
      title: "Intelligence Quotient (IQ)",
      description:
        "The core objective of the assessment is to measure cognitive reasoning using a short, balanced, and timed session. The experience is designed to be rigorous enough to feel meaningful while remaining accessible and completable within a single sitting.",
      type: "text",
      content:
        "Graytest is an AI-powered IQ-style assessment designed for cognitive insight and self-awareness. It simulates core reasoning domains found in traditional IQ testing, while using modern UX and behavioral signals to generate a personalized cognitive profile.\n\nIt does not produce a clinical IQ score.",
    },
    {
      title: "Intelligence Quotient (IQ)",
      description: "Every session covers exactly four cognitive dimensions:",
      type: "grid",
      content: [
        {
          title: "Pattern Recognition",
          description:
            "Identify regularities, trends, or recurring structures in data or information.",
        },
        {
          title: "Logical Reasoning",
          description:
            "Analyze information step by step to reach valid conclusions based on rules or relationships.",
        },
        {
          title: "Verbal Reasoning",
          description:
            "Understand, interpret, and reason using words and language.",
        },
        {
          title: "Spatial Reasoning",
          description:
            "Visualize, manipulate, and understand the relationships between objects in space.",
        },
      ] as DimensionCardData[],
    },
    {
      title: "Intelligence Quotient (IQ)",
      description:
        "Each test session consists of **32 questions in total** — 8 per dimension. These 32 questions must be completed within a **20-minute global countdown**. There is no per-question timer; the single countdown applies to the entire session, giving users the freedom to manage their time and return to earlier questions.",
      type: "info",
      content:
        "Each dimension has different difficulty levels - 3 easy, 3 medium and 2 hard. All questions are single choice with 4 options.",
    },
  ],
  eq: [],
  personality: [],
  spectrum: [],
};
