"use client";

interface Option {
  id: string;
  label: string;
}

interface RadioQuestionProps {
  questionNumber: number;
  questionText: string;
  options: Option[];
  selectedOption: string | null;
  onChange: (selectedId: string) => void;
}

export function RadioQuestion({
  questionNumber,
  questionText,
  options,
  selectedOption,
  onChange,
}: RadioQuestionProps) {
  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-12 text-white">
      <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug">
        {questionText}
      </p>

      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-4 md:gap-6 lg:gap-8 cursor-pointer transition-colors group"
          >
            <div
              className={`
                w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border-2 flex-shrink-0
                transition-all duration-200
                ${
                  selectedOption === option.id
                    ? "bg-[#D9D9D9] border-[#D9D9D9]"
                    : "border-[#D9D9D9] bg-transparent hover:bg-[#D9D9D9]/20"
                }
              `}
            />
            <input
              type="radio"
              name={`question-${questionNumber}`}
              checked={selectedOption === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            <span className="text-base md:text-lg lg:text-xl leading-snug">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
