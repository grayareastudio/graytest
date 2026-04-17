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
    <div className="space-y-8 text-white">
      <p className="text-2xl font-bold">{questionText}</p>

      <div>
        <div className="grid grid-cols-6 gap-1 mb-4">
          <div className="col-span-1" />

          {options.map((option) => (
            <div key={option.id} className="text-center">
              <span className="text-xl font-medium text-[#D9D9D9]">
                {option.label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-6 gap-1 items-center group"
            >
              <div className="col-span-1">
                <p className="text-xl text-[#efece7] group-hover:text-white transition-colors">
                  {row.question}
                </p>
              </div>

              {options.map((option) => {
                const isSelected = answers[row.id] === option.id;
                return (
                  <div key={option.id} className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => onChange(row.id, option.id)}
                      className={`
                        w-7.5 h-7.5 rounded-full border-2
                        transition-all duration-200 focus:outline-none
                        flex items-center justify-center
                        ${
                          isSelected
                            ? "bg-[#D9D9D9] border-[#D9D9D9]"
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
  );
}
