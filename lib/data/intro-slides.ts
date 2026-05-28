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
        "Each test session consists of **32 questions in total** — 8 per dimension. These 32 questions must be completed within a **15-minute global countdown**. There is no per-question timer; the single countdown applies to the entire session, giving users the freedom to manage their time and return to earlier questions.",
      type: "info",
      content:
        "Each dimension has different difficulty levels - 3 easy, 3 medium and 2 hard. All questions are single choice with 4 options.",
    },
  ],
  eq: [
    {
      title: "Emotional Quotient (EQ)",
      description:
        "The core objective of the assessment is to measure emotional intelligence and social-emotional competencies through realistic scenarios and self-reflection questions.",
      type: "text",
      content:
        "Graytest EQ assessment evaluates how well you perceive, understand, manage, and utilize emotions — both your own and those of others. This assessment uses modern scenario-based questions to generate a comprehensive emotional intelligence profile.\n\nIt is not a clinical psychological diagnosis.",
    },
    {
      title: "Emotional Quotient (EQ)",
      description: "Every session covers exactly four emotional intelligence dimensions:",
      type: "grid",
      content: [
        {
          title: "Self-Awareness",
          description:
            "Recognize and understand your own emotions, strengths, and limitations.",
        },
        {
          title: "Self-Management",
          description:
            "Regulate and control your emotions effectively in various situations.",
        },
        {
          title: "Empathy",
          description:
            "Understand and share the feelings of others with sensitivity.",
        },
        {
          title: "Social Skills",
          description:
            "Build and maintain healthy relationships through effective communication.",
        },
      ] as DimensionCardData[],
    },
    {
      title: "Emotional Quotient (EQ)",
      description:
        "Each test session consists of **32 questions in total** — 8 per dimension. These 32 questions must be completed within a **15-minute global countdown**.",
      type: "info",
      content:
        "Questions are presented in scenario and self-assessment formats. Each dimension contains a balanced mix of difficulty levels.",
    },
  ],

  personality: [
    {
      title: "Personality Assessment",
      description:
        "This assessment helps you understand your personality traits and behavioral tendencies using a modern adaptation of established personality frameworks.",
      type: "text",
      content:
        "Graytest Personality assessment explores your natural tendencies, preferences, and behavioral patterns across key personality dimensions. The results provide insights for self-development, career guidance, and better interpersonal understanding.",
    },
    {
      title: "Personality Assessment",
      description: "Every session covers the Big Five personality dimensions:",
      type: "grid",
      content: [
        {
          title: "Openness",
          description:
            "Curiosity, creativity, and openness to new experiences and ideas.",
        },
        {
          title: "Conscientiousness",
          description:
            "Organization, responsibility, and goal-directed behavior.",
        },
        {
          title: "Extraversion",
          description:
            "Sociability, assertiveness, and how you gain energy from others.",
        },
        {
          title: "Agreeableness",
          description:
            "Compassion, cooperation, and how you relate to others.",
        },
        {
          title: "Neuroticism",
          description:
            "Emotional stability and how you respond to stress and negative emotions.",
        },
      ] as DimensionCardData[],
    },
    {
      title: "Personality Assessment",
      description:
        "Each test session consists of **40 questions** with varying response formats. There is no time limit, allowing you to answer thoughtfully.",
      type: "info",
      content:
        "This assessment uses a combination of Likert-scale statements and situational questions to generate your personality profile.",
    },
  ],

  spectrum: [
    {
      title: "Cognitive & Behavioral Spectrum",
      description:
        "This assessment explores various cognitive and behavioral tendencies across a broad spectrum to help you better understand your unique mental wiring.",
      type: "text",
      content:
        "Graytest Spectrum assessment measures where you fall across different cognitive and behavioral continuums. It is designed to celebrate neurodiversity and provide deeper self-understanding.",
    },
    {
      title: "Cognitive & Behavioral Spectrum",
      description: "Every session covers four key spectrum dimensions:",
      type: "grid",
      content: [
        {
          title: "Thinking Style",
          description:
            "Analytical vs. Creative / Concrete vs. Abstract thinking preferences.",
        },
        {
          title: "Social Orientation",
          description:
            "Introversion-Extraversion spectrum and social energy patterns.",
        },
        {
          title: "Sensory Processing",
          description:
            "How you process sensory information and environmental stimuli.",
        },
        {
          title: "Adaptability",
          description:
            "Flexibility vs. preference for structure and routine.",
        },
      ] as DimensionCardData[],
    },
    {
      title: "Cognitive & Behavioral Spectrum",
      description:
        "Each test session consists of **36 questions** across the four spectrums. There is no strict time limit.",
      type: "info",
      content:
        "Results are presented as a spectrum profile rather than fixed categories, showing your unique position across each dimension.",
    },
  ],
};
