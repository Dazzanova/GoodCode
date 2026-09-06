// components/admin/problem-form.tsx
"use client";

import { useState, useTransition } from "react";
import { Difficulty } from "@prisma/client";

type Topic = { id: string; name: string };
type ProblemDefaults = {
  title?: string; slug?: string; description?: string;
  constraints?: string | null; difficulty?: Difficulty;
  topicId?: string; published?: boolean;
};

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
        <label className="text-sm text-zinc-400">Title</label>
        <input
          name="title"
          defaultValue={defaults?.title}
          required
          className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">Slug</label>
        <input
          name="slug"
          defaultValue={defaults?.slug}
          required
          className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">Description</label>
        <textarea
          name="description"
          defaultValue={defaults?.description}
          rows={4}
          required
          className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">Constraints</label>
        <textarea
          name="constraints"
          defaultValue={defaults?.constraints ?? ""}
          rows={2}
          className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-zinc-400">Topic</label>
          <select
            name="topicId"
            defaultValue={defaults?.topicId}
            required
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="text-sm text-zinc-400">Difficulty</label>
          <select
            name="difficulty"
            defaultValue={defaults?.difficulty}
            required
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input type="checkbox" name="published" defaultChecked={defaults?.published} />
        Published
      </label>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}