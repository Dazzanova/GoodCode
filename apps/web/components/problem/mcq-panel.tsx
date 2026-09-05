"use client";

import { useState } from "react";

type MCQOption = { id: string; text: string; isCorrect: boolean };
type MCQ = { id: string; question: string; options: MCQOption[] };

export function MCQPanel({ mcqs }: { mcqs: MCQ[] }) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  if (mcqs.length === 0) return null;

  return (
    <div className="mt-6 border-t border-zinc-800 pt-6">
      <h2 className="text-sm font-medium text-zinc-400">Thinking Check</h2>

      <div className="mt-4 space-y-6">
        {mcqs.map((mcq) => {
          const pickedId = selected[mcq.id];
          const picked = mcq.options.find((o) => o.id === pickedId);

          return (
            <div key={mcq.id}>
              <p className="text-sm text-zinc-300">{mcq.question}</p>

              <div className="mt-3 space-y-2">
                {mcq.options.map((opt) => {
                  const isPicked = pickedId === opt.id;
                  const showResult = !!pickedId;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={showResult}
                      onClick={() =>
                        setSelected((prev) => ({ ...prev, [mcq.id]: opt.id }))
                      }
                      className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                        showResult && opt.isCorrect
                          ? "border-emerald-700 bg-emerald-950/40 text-emerald-300"
                          : showResult && isPicked && !opt.isCorrect
                            ? "border-rose-800 bg-rose-950/40 text-rose-300"
                            : "border-zinc-800 text-zinc-400 hover:border-zinc-700 disabled:cursor-default"
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {picked && (
                <p className="mt-2 text-sm text-zinc-500">
                  {picked.isCorrect
                    ? "Correct."
                    : "Not quite — the correct answer is highlighted above."}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}