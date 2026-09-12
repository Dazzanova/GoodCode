"use client";

import { useState } from "react";
import { clsx } from "clsx";

type MCQOption = { id: string; text: string; isCorrect: boolean };
type MCQ = { id: string; question: string; options: MCQOption[] };

export function MCQPanel({ mcqs }: { mcqs: MCQ[] }) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  if (mcqs.length === 0) return null;

  return (
    <div className="mt-6 border-t border-border pt-6">
      <h2 className="text-sm font-medium text-muted">Thinking Check</h2>

      <div className="mt-4 space-y-6">
        {mcqs.map((mcq) => {
          const pickedId = selected[mcq.id];
          const picked = mcq.options.find((o) => o.id === pickedId);

          return (
            <div key={mcq.id}>
              <p className="text-sm text-foreground">{mcq.question}</p>

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
                      className={clsx(
                        "block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        showResult && opt.isCorrect
                          ? "border-success/40 bg-success/10 text-success"
                          : showResult && isPicked && !opt.isCorrect
                            ? "border-danger/40 bg-danger/10 text-danger"
                            : "border-border text-muted hover:border-accent/40 disabled:cursor-default"
                      )}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {picked && (
                <p className="mt-2 text-sm text-muted">
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