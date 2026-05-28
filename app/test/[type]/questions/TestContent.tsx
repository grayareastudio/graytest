// app/test/[type]/questions/TestContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useTest } from "@/lib/test/TestContext";
import { DimensionInfoScreen } from "@/components/sections/test/DimensionInfoScreen";

import { RadioQuestion } from "@/components/sections/test/RadioQuestion";
import { CheckboxQuestion } from "@/components/sections/test/CheckboxQuestion";
import { MatrixQuestion } from "@/components/sections/test/MatrixQuestion";
import { OpenEndedQuestion } from "@/components/sections/test/OpenEndedQuestion";
import { VisualQuestion } from "@/components/sections/test/VisualQuestion";
import { LikertQuestion } from "@/components/sections/test/LikertQuestion";

export function TestContent({ type }: { type: string }) {
  const {
    dimensions,
    currentDimensionIndex,
    currentQuestion,
    answers,
    setAnswer,
    showDimensionInfo,
    prevDimension,
    setShowDimensionInfo,
  } = useTest();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dimensions.length > 0) {
      setLoading(false);
    }
  }, [dimensions]);

  if (loading) {
    return <div className="text-white text-center py-20">Loading test...</div>;
  }

  const currentDimension = dimensions[currentDimensionIndex];

  if (showDimensionInfo) {
    return (
      <DimensionInfoScreen
        dimension={currentDimension}
        onStart={() => setShowDimensionInfo(false)}
        onPrevious={prevDimension}
        canGoPrevious={currentDimensionIndex > 0}
      />
    );
  }

  if (!currentQuestion) {
    return <div className="text-white">No questions available.</div>;
  }

  const currentAnswer = answers[currentQuestion.id] ?? null;

  switch (currentQuestion.type) {
    case "radio":
      return (
        <RadioQuestion
          questionNumber={currentQuestion.id}
          questionText={currentQuestion.text}
          options={currentQuestion.options || []}
          selectedOption={currentAnswer}
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
          options={currentQuestion.options || []}
          selectedOption={currentAnswer}
          onChange={(val) => setAnswer(currentQuestion.id, val)}
        />
      );
    case "likert":
    case "likert_5":
    case "likert_4":
      return (
        <LikertQuestion
          questionNumber={currentQuestion.id}
          questionText={currentQuestion.text}
          options={currentQuestion.options || []}
          selectedOption={currentAnswer}
          onChange={(val) => setAnswer(currentQuestion.id, val)}
        />
      );
    default:
      return <p className="text-red-400">Error.</p>;
  }
}
