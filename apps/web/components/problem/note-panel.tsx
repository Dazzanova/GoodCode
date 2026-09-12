"use client";

import { useState, useTransition } from "react";
import { saveNote } from "@/app/problems/[slug]/actions";
import { Button } from "@/components/ui/button";

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
    <div className="mt-6 border-t border-border pt-6">
      <h2 className="text-sm font-medium text-muted">My Notes</h2>

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
          className="w-full rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" variant="secondary" disabled={isPending}>
            {isPending ? "Saving..." : "Save note"}
          </Button>
          {status === "saved" && <span className="text-sm text-success">Saved</span>}
          {status === "cleared" && <span className="text-sm text-muted">Note cleared</span>}
        </div>
      </form>
    </div>
  );
}