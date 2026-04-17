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
    <div className="space-y-15 text-white">
      <p className="text-2xl font-bold">{questionText}</p>

      <div className="space-y-10">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-8 cursor-pointer transition-colors group"
          >
            <div
              className={`
                w-7.5 h-7.5 rounded-full border-2
                transition-all duration-200
                ${
                  selectedOption === option.id
                    ? "bg-[#D9D9D9]"
                    : "border-[#D9D9D9] bg-transparent hover:bg-[#D9D9D9]/20"
                }
              `}
            ></div>
            <input
              type="radio"
              name={`question-${questionNumber}`}
              checked={selectedOption === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            <span className="text-2xl">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
