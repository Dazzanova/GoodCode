"use client";

import { useState, useTransition } from "react";
import { createMCQAction, deleteMCQAction } from "@/app/admin/problems/actions";

type Option = { text: string; isCorrect: boolean };
type MCQ = { id: string; question: string; options: { id: string; text: string; isCorrect: boolean }[] };

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
        <div key={mcq.id} className="rounded-md border border-zinc-800 p-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-zinc-200">{mcq.question}</p>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleDelete(mcq.id)}
              className="shrink-0 rounded-md border border-zinc-800 px-2 py-1 text-xs text-rose-500 hover:bg-rose-950/30 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {mcq.options.map((o) => (
              <li
                key={o.id}
                className={`text-sm ${o.isCorrect ? "text-emerald-500" : "text-zinc-500"}`}
              >
                {o.isCorrect ? "✓ " : "— "}
                {o.text}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {mcqs.length === 0 && <p className="text-sm text-zinc-600">No MCQs yet.</p>}

      <div className="rounded-md border border-zinc-800 p-4">
        <p className="text-sm font-medium text-zinc-300">Add MCQ</p>

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="mt-3 w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
        />

        <div className="mt-3 space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={opt.isCorrect}
                onChange={() => setCorrect(i)}
              />
              <input
                value={opt.text}
                onChange={(e) => updateOptionText(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="text-xs text-zinc-500 hover:text-rose-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={addOption}
            disabled={options.length >= 6}
            className="text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-50"
          >
            + Add option
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

        <button
          type="button"
          onClick={handleCreate}
          disabled={isPending || !question.trim()}
          className="mt-4 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save MCQ"}
        </button>
      </div>
    </div>
  );
}