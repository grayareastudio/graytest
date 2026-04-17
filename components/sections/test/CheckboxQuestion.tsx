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
    <div className="space-y-15 text-white">
      <p className="text-2xl font-bold">{questionText}</p>

      <div className="space-y-10">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <label
              key={option.id}
              className="flex items-center gap-8 cursor-pointer transition-colors group"
            >
              <div
                className={`
                  w-7.5 h-7.5 rounded border-2 flex items-center justify-center
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
                    className="w-5 h-5 text-black"
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
              <span className="text-2xl">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
