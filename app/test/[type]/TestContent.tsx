// app/test/[type]/TestContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useTest } from "@/lib/test/TestContext";
import { getTestQuestions } from "@/lib/actions/test-actions";
import { type Question, type QuestionType } from "@/lib/test/questions";
import { RadioQuestion } from "@/components/sections/test/RadioQuestion";
import { CheckboxQuestion } from "@/components/sections/test/CheckboxQuestion";
import { MatrixQuestion } from "@/components/sections/test/MatrixQuestion";
import { OpenEndedQuestion } from "@/components/sections/test/OpenEndedQuestion";
import { VisualQuestion } from "@/components/sections/test/VisualQuestion";

export function TestContent({ type }: { type: string }) {
  const { currentQuestionIndex, answers, setAnswer } = useTest();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await getTestQuestions(type);
        console.log("First question type:", data[0]?.type);

        console.log(
          "All types:",
          data.map((q) => q.type),
        );

        setQuestions(data);
      } catch (error) {
        console.error("Failed:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [type]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!questions.length)
    return <p className="text-white">No questions available.</p>;

  const currentQuestion = questions[currentQuestionIndex];
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
