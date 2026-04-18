"use client";

interface Option {
  id: string;
  label: string;
}

interface CheckboxQuestionProps {
  questionNumber: number;
  questionText: string;
  options: Option[];
  selectedOptions: string[];
  onChange: (selectedIds: string[]) => void;
}

export function CheckboxQuestion({
  questionText,
  options,
  selectedOptions,
  onChange,
}: CheckboxQuestionProps) {
  const handleToggle = (optionId: string) => {
    const newSelected = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];
    onChange(newSelected);
  };

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-12 text-white">
      <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug">
        {questionText}
      </p>

      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <label
              key={option.id}
              className="flex items-center gap-4 md:gap-6 lg:gap-8 cursor-pointer transition-colors group"
            >
              <div
                className={`
                  w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded border-2 shrink-0 flex items-center justify-center
                  transition-all duration-200
                  ${
                    isSelected
                      ? "bg-[#D9D9D9] border-[#D9D9D9]"
                      : "bg-transparent border-[#D9D9D9] hover:bg-[#D9D9D9]/20"
                  }
                `}
              >
                {isSelected && (
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(option.id)}
                className="sr-only"
              />
              <span className="text-base md:text-lg lg:text-xl leading-snug">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
