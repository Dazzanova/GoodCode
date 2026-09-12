"use client";

import { useState, useTransition } from "react";
import { createMCQAction, deleteMCQAction } from "@/app/admin/problems/actions";
import { Button } from "@/components/ui/button";

type Option = { text: string; isCorrect: boolean };
type MCQ = { id: string; question: string; options: { id: string; text: string; isCorrect: boolean }[] };

const inputClass =
  "flex-1 rounded-md border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent";

export function MCQsManager({ problemId, mcqs }: { problemId: string; mcqs: MCQ[] }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const updateOptionText = (i: number, text: string) => {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, text } : o)));
  };

  const setCorrect = (i: number) => {
    setOptions((prev) => prev.map((o, idx) => ({ ...o, isCorrect: idx === i })));
  };

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions((prev) => [...prev, { text: "", isCorrect: false }]);
  };

  const removeOption = (i: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleCreate = () => {
    setError(null);
    const fd = new FormData();
    fd.set("problemId", problemId);
    fd.set("question", question);
    fd.set("optionsJson", JSON.stringify(options));

    startTransition(async () => {
      try {
        await createMCQAction(fd);
        setQuestion("");
        setOptions([{ text: "", isCorrect: false }, { text: "", isCorrect: false }]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  const handleDelete = (mcqId: string) => {
    const fd = new FormData();
    fd.set("mcqId", mcqId);
    fd.set("problemId", problemId);
    startTransition(async () => {
      try {
        await deleteMCQAction(fd);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  return (
    <div className="mt-4 space-y-6">
      {mcqs.map((mcq) => (
        <div key={mcq.id} className="rounded-md border border-border p-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-foreground">{mcq.question}</p>
            <Button
              type="button"
              variant="danger"
              disabled={isPending}
              onClick={() => handleDelete(mcq.id)}
            >
              Delete
            </Button>
          </div>
          <ul className="mt-2 space-y-1">
            {mcq.options.map((o) => (
              <li key={o.id} className={`text-sm ${o.isCorrect ? "text-success" : "text-muted"}`}>
                {o.isCorrect ? "✓ " : "— "}
                {o.text}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {mcqs.length === 0 && <p className="text-sm text-muted">No MCQs yet.</p>}

      <div className="rounded-md border border-border p-4">
        <p className="text-sm font-medium text-foreground">Add MCQ</p>

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className={`mt-3 ${inputClass}`}
        />

        <div className="mt-3 space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" name="correct" checked={opt.isCorrect} onChange={() => setCorrect(i)} />
              <input
                value={opt.text}
                onChange={(e) => updateOptionText(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className={inputClass}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="text-xs text-muted hover:text-danger"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          disabled={options.length >= 6}
          className="mt-3 text-sm text-accent hover:underline disabled:opacity-50"
        >
          + Add option
        </button>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <div className="mt-4">
          <Button type="button" onClick={handleCreate} disabled={isPending || !question.trim()}>
            {isPending ? "Saving..." : "Save MCQ"}
          </Button>
        </div>
      </div>
    </div>
  );
}