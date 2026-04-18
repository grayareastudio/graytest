"use client";

interface MatrixOption {
  id: string;
  label: string;
}

interface MatrixRow {
  id: string;
  question: string;
}

interface MatrixQuestionProps {
  questionText: string;
  rows: MatrixRow[];
  options: MatrixOption[];
  answers: Record<string, string>;
  onChange: (rowId: string, optionId: string) => void;
}

export function MatrixQuestion({
  questionText,
  rows,
  options,
  answers,
  onChange,
}: MatrixQuestionProps) {
  return (
    <div className="space-y-6 md:space-y-8 text-white">
      {/* Question Title */}
      <p className="text-xl md:text-2xl font-bold">{questionText}</p>

      {/* Scroll Container */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 max-w-screen">
        <div className="min-w-[150vw] md:min-w-0">
          <div className="grid grid-cols-6 gap-4 mb-8">
            <div className="col-span-1" /> {/* Empty spacer for alignment */}
            {options.map((option) => (
              <div key={option.id} className="text-center">
                <span className="text-sm md:text-xl font-medium text-[#D9D9D9]">
                  {option.label}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-8 md:space-y-12">
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-6 gap-4 items-center group"
              >
                {/* Row Label: Column 1 */}
                <div className="col-span-1 pr-4 md:pr-8">
                  <p className="text-sm md:text-xl text-[#efece7] group-hover:text-white transition-colors leading-snug">
                    {row.question}
                  </p>
                </div>

                {/* Options: Columns 2-6 */}
                {options.map((option) => {
                  const isSelected = answers[row.id] === option.id;
                  return (
                    <div key={option.id} className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => onChange(row.id, option.id)}
                        className={`
                          w-7 h-7 md:w-8 md:h-8 rounded-full border-2
                          transition-all duration-200 focus:outline-none
                          flex items-center justify-center
                          ${
                            isSelected
                              ? "bg-[#D9D9D9] border-[#D9D9D9] shadow-[0_0_10px_rgba(217,217,217,0.3)]"
                              : "border-[#D9D9D9] bg-transparent hover:bg-[#D9D9D9]/20"
                          }
                        `}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
