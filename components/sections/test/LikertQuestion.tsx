"use client";

interface Option {
  id: string;
  label: string;
}

interface LikertQuestionProps {
  questionNumber: number;
  questionText: string;
  options: Option[];
  selectedOption: string | null;
  onChange: (selectedId: string) => void;
}

export function LikertQuestion({
  questionNumber,
  questionText,
  options,
  selectedOption,
  onChange,
}: LikertQuestionProps) {
  return (
    <div className="space-y-10 md:space-y-14 text-white flex flex-col items-center w-full">
      <p className="text-xl md:text-2xl font-medium text-center max-w-2xl leading-relaxed">
        {questionText}
      </p>

      {/* Horizontal scale */}
      <div className="w-full max-w-3xl">
        {/* Option buttons */}
        <div className="flex items-end justify-between gap-2 md:gap-3">
          {options.map((option, index) => {
            const isSelected = selectedOption === option.id;
            const mid = (options.length - 1) / 2;
            const dist = Math.abs(index - mid);
            const sizeMap = ["w-10 h-10", "w-9 h-9", "w-8 h-8", "w-7 h-7", "w-6 h-6"];
            const dotSize = sizeMap[Math.min(Math.round(dist), sizeMap.length - 1)] ?? "w-8 h-8";

            return (
              <label
                key={option.id}
                className="flex flex-col items-center gap-3 cursor-pointer group flex-1"
              >
                <input
                  type="radio"
                  name={`question-${questionNumber}`}
                  checked={isSelected}
                  onChange={() => onChange(option.id)}
                  className="sr-only"
                />
                {/* Dot */}
                <div
                  className={`
                    ${dotSize} rounded-full border-2 transition-all duration-200 flex items-center justify-center
                    ${isSelected
                      ? "bg-[#D9D9D9] border-[#D9D9D9] scale-110"
                      : "bg-white/10 border-white/20 group-hover:border-white/60 group-hover:bg-white/20"
                    }
                  `}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
                {/* Label */}
                <span
                  className={`
                    text-center text-[10px] md:text-xs leading-tight transition-colors duration-200 max-w-[70px]
                    ${isSelected ? "text-white font-medium" : "text-white/50 group-hover:text-white/80"}
                  `}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>

        {/* Connecting line behind dots */}
        <div className="relative mt-0 -translate-y-[calc(50%+1.5rem)] pointer-events-none">
          <div className="h-px bg-white/10 w-full" />
        </div>
      </div>
    </div>
  );
}
