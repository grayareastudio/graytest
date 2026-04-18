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
    <div className="space-y-4 md:space-y-5 w-full">
      {/* Label: Mobile stack, desktop inline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-17.5">
        <p className="lg:col-start-2 text-lg md:text-xl">Choose your answer:</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-17.5">
        {/* Main Image */}
        <div className="aspect-[4/3] bg-[#111] rounded-xl overflow-hidden border border-white/10">
          <img
            src={mainImage}
            alt="Question visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Options: 1 col mobile, 2 col tablet+ */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-10">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`
              aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden
              transition-all duration-200 border-2
              ${selectedOption === option.id ? "border-white ring-2 ring-white/20" : "border-transparent hover:border-[#D9D9D9]/50"}
            `}
            >
              {option.imageUrl ? (
                <img
                  src={option.imageUrl}
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#111] flex items-center justify-center">
                  <span className="text-[#efece7]/70 text-sm md:text-base">
                    {option.label}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
