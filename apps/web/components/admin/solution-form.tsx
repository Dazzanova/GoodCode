"use client";

import { useState, useTransition } from "react";
import { upsertSolutionAction } from "@/app/admin/problems/actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent";

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
        <label className="text-sm text-muted">Editorial</label>
        <textarea
          name="editorial"
          defaultValue={defaults?.editorial}
          rows={4}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm text-muted">Code Snippet</label>
        <textarea
          name="codeSnippet"
          defaultValue={defaults?.codeSnippet ?? ""}
          rows={6}
          spellCheck={false}
          className={`${inputClass} font-mono`}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "Saving..." : "Save Solution"}
        </Button>
        {saved && <span className="text-sm text-success">Saved</span>}
      </div>
    </form>
  );
}