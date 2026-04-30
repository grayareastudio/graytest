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
    <div className="space-y-8 md:space-y-12 text-white flex flex-col items-center">
      <p className="text-xl md:text-2xl font-medium text-center max-w-2xl leading-relaxed">
        {questionText}
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {options.map((option) => (
          <label
            key={option.id}
            className={`
              flex items-center justify-center px-6 py-4 
              rounded-full cursor-pointer transition-all duration-200 border
              font-semibold
              ${
                selectedOption === option.id
                  ? "bg-[#D9D9D9] border-[#D9D9D9] text-black"
                  : "bg-white/10 border-white/10 text-white hover:bg-[#1a1a1a]"
              }
            `}
          >
            <input
              type="radio"
              name={`question-${questionNumber}`}
              checked={selectedOption === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            <span className="truncate">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
