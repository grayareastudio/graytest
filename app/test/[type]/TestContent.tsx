// app/test/[type]/TestContent.tsx
"use client";

import { useTest } from "@/lib/test/TestContext";
import { getTestConfig, Question } from "@/lib/test/questions"; // ← Import dari file terpisah
import { RadioQuestion } from "@/components/sections/test/RadioQuestion";
import { CheckboxQuestion } from "@/components/sections/test/CheckboxQuestion";
import { MatrixQuestion } from "@/components/sections/test/MatrixQuestion";
import { OpenEndedQuestion } from "@/components/sections/test/OpenEndedQuestion";
import { VisualQuestion } from "@/components/sections/test/VisualQuestion";

export function TestContent({ type }: { type: string }) {
  const { currentQuestionIndex, answers, setAnswer } = useTest();

  const config = getTestConfig(type);
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
