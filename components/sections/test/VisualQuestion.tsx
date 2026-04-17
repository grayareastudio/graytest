"use client";

interface Option {
  id: string;
  imageUrl?: string;
  label?: string;
}

interface VisualQuestionProps {
  questionNumber: number;
  questionText: string;
  mainImage: string;
  options: Option[];
  selectedOption: string | null;
  onChange: (selectedId: string) => void;
}

export function VisualQuestion({
  questionNumber,
  questionText,
  mainImage,
  options,
  selectedOption,
  onChange,
}: VisualQuestionProps) {
  return (
    <div className="space-y-5 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-17.5">
        <p className="lg:col-start-2">Choose your answer:</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-17.5">
        {/* Main Image */}
        <div className="aspect-4/3 bg-[#D9D9D9] rounded-xl overflow-hidden border border-white/10 flex items-end">
          <img
            src={mainImage}
            alt="Question visual"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => onChange(option.id)}
                className={`
                  aspect-4/3 rounded-md overflow-hidden
                  transition-all duration-200 hover:cursor-pointer bg-[#D9D9D9]
                  ${
                    selectedOption === option.id
                      ? "border-white ring-2 ring-white/20"
                      : ""
                  }
                `}
              >
                {option.imageUrl ? (
                  <img
                    src={option.imageUrl}
                    alt={option.label || `Option ${option.id}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <span className="text-[#efece7]/70">{option.label}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
