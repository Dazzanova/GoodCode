"use client";

import { useState, useTransition } from "react";
import { saveNote } from "@/app/problems/[slug]/actions";

export function NotePanel({
  problemId,
  slug,
  initialContent,
}: {
  problemId: string;
  slug: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "cleared">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    setStatus("idle");
    const wasEmpty = (formData.get("content") as string).trim().length === 0;

    startTransition(async () => {
      try {
        await saveNote(formData);
        setStatus(wasEmpty ? "cleared" : "saved");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  return (
    <div className="mt-6 border-t border-zinc-800 pt-6">
      <h2 className="text-sm font-medium text-zinc-400">My Notes</h2>

      <form action={handleSubmit} className="mt-3 space-y-3">
        <input type="hidden" name="problemId" value={problemId} />
        <input type="hidden" name="slug" value={slug} />

        <textarea
          name="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setStatus("idle");
          }}
          rows={4}
          placeholder="What was your approach? What did you get wrong? How would you recognize this pattern next time?"
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
        />

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save note"}
          </button>
          {status === "saved" && <span className="text-sm text-emerald-500">Saved</span>}
          {status === "cleared" && <span className="text-sm text-zinc-500">Note cleared</span>}
        </div>
      </form>
    </div>
  );
}