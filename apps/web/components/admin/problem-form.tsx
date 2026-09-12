"use client";

import { useState, useTransition } from "react";
import { Difficulty } from "@prisma/client";
import { Button } from "@/components/ui/button";

type Topic = { id: string; name: string };
type ProblemDefaults = {
  title?: string; slug?: string; description?: string;
  constraints?: string | null; difficulty?: Difficulty;
  topicId?: string; published?: boolean;
};

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent";

export function ProblemForm({
  action,
  topics,
  defaults,
}: {
  action: (formData: FormData) => Promise<void>;
  topics: Topic[];
  defaults?: ProblemDefaults;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        await action(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  return (
    <form action={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="text-sm text-muted">Title</label>
        <input name="title" defaultValue={defaults?.title} required className={inputClass} />
      </div>

      <div>
        <label className="text-sm text-muted">Slug</label>
        <input name="slug" defaultValue={defaults?.slug} required className={inputClass} />
      </div>

      <div>
        <label className="text-sm text-muted">Description</label>
        <textarea
          name="description"
          defaultValue={defaults?.description}
          rows={4}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm text-muted">Constraints</label>
        <textarea
          name="constraints"
          defaultValue={defaults?.constraints ?? ""}
          rows={2}
          className={inputClass}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-muted">Topic</label>
          <select name="topicId" defaultValue={defaults?.topicId} required className={inputClass}>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="text-sm text-muted">Difficulty</label>
          <select name="difficulty" defaultValue={defaults?.difficulty} required className={inputClass}>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" name="published" defaultChecked={defaults?.published} />
        Published
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}