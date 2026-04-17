"use client";

import { useTest } from "@/lib/test/TestContext";
import { RadioQuestion } from "@/components/sections/test/RadioQuestion";
import { CheckboxQuestion } from "@/components/sections/test/CheckboxQuestion";
import { MatrixQuestion } from "@/components/sections/test/MatrixQuestion";
import { OpenEndedQuestion } from "@/components/sections/test/OpenEndedQuestion";
import { VisualQuestion } from "@/components/sections/test/VisualQuestion";

type QuestionType = "radio" | "checkbox" | "matrix" | "open" | "visual";

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: { id: string; label: string }[];
  rows?: { id: string; question: string }[];
  mainImage?: string;
  visualOptions?: { id: string; imageUrl: string; alt?: string }[];
}

const TEST_CONFIG: Record<string, { questions: any[] }> = {
  iq: {
    questions: [
      // --- RADIO (Single Select) ---
      {
        id: 1,
        type: "radio" as const,
        text: "What comes next in the sequence: 2, 4, 8, 16, ?",
        options: [
          { id: "a", label: "24" },
          { id: "b", label: "32" },
          { id: "c", label: "20" },
          { id: "d", label: "30" },
          { id: "e", label: "28" },
        ],
      },
      {
        id: 2,
        type: "radio" as const,
        text: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
        options: [
          { id: "a", label: "Yes" },
          { id: "b", label: "No" },
          { id: "c", label: "Cannot be determined" },
          { id: "d", label: "Only sometimes" },
          { id: "e", label: "Not enough information" },
        ],
      },
      {
        id: 3,
        type: "radio" as const,
        text: "A clock shows 3:15. What is the angle between the hour and minute hands?",
        options: [
          { id: "a", label: "0°" },
          { id: "b", label: "7.5°" },
          { id: "c", label: "15°" },
          { id: "d", label: "22.5°" },
          { id: "e", label: "30°" },
        ],
      },

      // --- CHECKBOX (Multi Select) ---
      {
        id: 4,
        type: "checkbox" as const,
        text: "Select all prime numbers from the list:",
        options: [
          { id: "a", label: "2" },
          { id: "b", label: "3" },
          { id: "c", label: "4" },
          { id: "d", label: "5" },
          { id: "e", label: "9" },
        ],
      },
      {
        id: 5,
        type: "checkbox" as const,
        text: "Which of the following are cognitive assessment types? (Select all that apply)",
        options: [
          { id: "a", label: "IQ Test" },
          { id: "b", label: "EQ Test" },
          { id: "c", label: "Blood Test" },
          { id: "d", label: "Personality Assessment" },
          { id: "e", label: "X-Ray" },
        ],
      },

      // --- MATRIX (Likert Scale) ---
      {
        id: 6,
        type: "matrix" as const,
        text: "Rate how confident you feel about each problem-solving approach:",
        rows: [
          { id: "r1", question: "Breaking problems into smaller steps" },
          { id: "r2", question: "Looking for patterns in data" },
          { id: "r3", question: "Testing multiple solutions quickly" },
          { id: "r4", question: "Verifying answers with logic" },
          { id: "r5", question: "Working under time pressure" },
        ],
        options: [
          { id: "1", label: "Not Confident" },
          { id: "2", label: "Slightly Confident" },
          { id: "3", label: "Neutral" },
          { id: "4", label: "Confident" },
          { id: "5", label: "Very Confident" },
        ],
      },

      // --- OPEN (Text Input) ---
      {
        id: 7,
        type: "open" as const,
        text: "Describe a complex problem you solved recently. What was your thought process, and what would you do differently next time?",
      },
      {
        id: 8,
        type: "open" as const,
        text: "When faced with an unfamiliar pattern or puzzle, what is your first instinct? Walk us through your approach.",
      },
      // --- VISUAL (Pattern Recognition) ---
      {
        id: 9,
        type: "visual" as const,
        text: "Which image completes the pattern?",
        mainImage: "/images/patterns/q9-main.png",
        visualOptions: [
          { id: "a", imageUrl: "/images/patterns/q9-a.png", alt: "Option A" },
          { id: "b", imageUrl: "/images/patterns/q9-b.png", alt: "Option B" },
          { id: "c", imageUrl: "/images/patterns/q9-c.png", alt: "Option C" },
          { id: "d", imageUrl: "/images/patterns/q9-d.png", alt: "Option D" },
        ],
      },
      {
        id: 10,
        type: "visual" as const,
        text: "Select the shape that follows the sequence:",
        mainImage: "/images/patterns/q10-main.png",
        visualOptions: [
          { id: "a", imageUrl: "/images/patterns/q10-a.png", alt: "Option A" },
          { id: "b", imageUrl: "/images/patterns/q10-b.png", alt: "Option B" },
          { id: "c", imageUrl: "/images/patterns/q10-c.png", alt: "Option C" },
          { id: "d", imageUrl: "/images/patterns/q10-d.png", alt: "Option D" },
        ],
      },
    ],
  },
};

export function TestContent({ type }: { type: string }) {
  const { currentQuestionIndex, answers, setAnswer } = useTest();

  const config = TEST_CONFIG[type] || TEST_CONFIG.iq;
  const currentQuestion = config.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id];

  if (!currentQuestion) return null;

  switch (currentQuestion.type) {
    case "radio":
      return (
        <RadioQuestion
          questionNumber={currentQuestion.id}
          questionText={currentQuestion.text}
          options={currentQuestion.options || []}
          selectedOption={currentAnswer || null}
          onChange={(val) => setAnswer(currentQuestion.id, val)}
        />
      );
    case "checkbox":
      return (
        <CheckboxQuestion
          questionNumber={currentQuestion.id}
          questionText={currentQuestion.text}
          options={currentQuestion.options || []}
          selectedOptions={currentAnswer || []}
          onChange={(val) => setAnswer(currentQuestion.id, val)}
        />
      );
    case "matrix":
      return (
        <MatrixQuestion
          questionText={currentQuestion.text}
          rows={currentQuestion.rows || []}
          options={currentQuestion.options || []}
          answers={currentAnswer || {}}
          onChange={(rowId, optionId) => {
            const newAnswers = currentAnswer || {};
            setAnswer(currentQuestion.id, { ...newAnswers, [rowId]: optionId });
          }}
        />
      );
    case "open":
      return (
        <OpenEndedQuestion
          questionNumber={currentQuestion.id}
          questionText={currentQuestion.text}
          value={currentAnswer || ""}
          onChange={(val) => setAnswer(currentQuestion.id, val)}
        />
      );
    case "visual":
      return (
        <VisualQuestion
          questionNumber={currentQuestion.id}
          questionText={currentQuestion.text}
          mainImage={currentQuestion.mainImage || ""}
          options={currentQuestion.visualOptions || []}
          selectedOption={currentAnswer || null}
          onChange={(val) => setAnswer(currentQuestion.id, val)}
        />
      );
    default:
      return null;
  }
}
