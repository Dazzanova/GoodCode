"use client";

import { useState, useTransition } from "react";
import { createTopicAction, createPatternAction } from "@/app/admin/taxonomy/actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "flex-1 rounded-md border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent";

export function TaxonomyForm({ kind }: { kind: "topic" | "pattern" }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(null);
    const fd = new FormData();
    fd.set("name", name);
    if (kind === "pattern") fd.set("description", description);

    startTransition(async () => {
      try {
        if (kind === "topic") await createTopicAction(fd);
        else await createPatternAction(fd);
        setName("");
        setDescription("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`New ${kind} name...`}
          className={inputClass}
        />
        <Button type="button" variant="secondary" onClick={handleSubmit} disabled={isPending || !name.trim()}>
          Add
        </Button>
      </div>
      {kind === "pattern" && (
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className={inputClass}
        />
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}