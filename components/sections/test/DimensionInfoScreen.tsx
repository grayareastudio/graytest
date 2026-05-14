"use client";

import { Button } from "@/components/ui/Button";
import GradientText from "@/components/ui/GradientText";
import { useTest } from "@/lib/test/TestContext";

interface DimensionInfoScreenProps {
  dimension: {
    id: string;
    code?: string;
    name: string;
    description?: string;
    info_content?: string;
    sort_order: number;
  };
  onStart: () => void;
  onPrevious: () => void;
  canGoPrevious?: boolean;
}

export function DimensionInfoScreen({
  dimension,
  onStart,
  onPrevious,
  canGoPrevious = false,
}: DimensionInfoScreenProps) {
  const { currentDimensionIndex, dimensions } = useTest();

  const totalDimensions = dimensions.length;
  const currentDimensionNumber = currentDimensionIndex + 1;

  return (
    <div className="max-w-5xl mx-auto flex flex-col justify-center h-full mt-12">
      {/* Dimension Name */}
      <h1 className="text-4xl md:text-5xl font-serif text-white mb-8">
        <GradientText>{dimension.name}</GradientText>
      </h1>

      {/* Info Content */}
      {dimension.info_content && (
        <div className="text-2xl font-light mb-9 leading-relaxed">
          {dimension.info_content}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-6 justify-center">
        {canGoPrevious && (
          <Button onClick={onPrevious} variant="primary">
            Previous
          </Button>
        )}

        <Button onClick={onStart} variant="secondary">
          Start
        </Button>
      </div>
    </div>
  );
}
