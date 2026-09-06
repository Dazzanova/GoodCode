// components/admin/solution-form.tsx
"use client";

import { useState, useTransition } from "react";
import { upsertSolutionAction } from "@/app/admin/problems/actions";

export function SolutionForm({
  problemId,
  defaults,
}: {
  problemId: string;
  defaults?: { editorial: string; codeSnippet: string | null } | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await upsertSolutionAction(formData);
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  return (
    <form action={handleSubmit} className="mt-4 space-y-4">
      <input type="hidden" name="problemId" value={problemId} />

      <div>
        <label className="text-sm text-zinc-400">Editorial</label>
        <textarea
          name="editorial"
          defaultValue={defaults?.editorial}
          rows={4}
          required
          className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">Code Snippet</label>
        <textarea
          name="codeSnippet"
          defaultValue={defaults?.codeSnippet ?? ""}
          rows={6}
          spellCheck={false}
          className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 font-mono text-sm text-zinc-200"
        />
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Solution"}
        </button>
        {saved && <span className="text-sm text-emerald-500">Saved</span>}
      </div>
    </form>
  );
}