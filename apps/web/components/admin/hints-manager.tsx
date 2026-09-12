"use client";

import { useState, useTransition } from "react";
import {
  createHintAction,
  updateHintAction,
  deleteHintAction,
} from "@/app/admin/problems/actions";
import { Button } from "@/components/ui/button";

type Hint = { id: string; order: number; content: string };

const inputClass =
  "flex-1 rounded-md border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent";

export function HintsManager({
  problemId,
  hints,
}: {
  problemId: string;
  hints: Hint[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [newHintText, setNewHintText] = useState("");
  const [isPending, startTransition] = useTransition();

  const runAction = (fn: (fd: FormData) => Promise<void>, formData: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        await fn(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  const handleAdd = () => {
    if (!newHintText.trim()) return;
    const fd = new FormData();
    fd.set("problemId", problemId);
    fd.set("content", newHintText);
    runAction(createHintAction, fd);
    setNewHintText("");
  };

  return (
    <div className="mt-4 space-y-3">
      {hints.map((h) => (
        <HintRow
          key={h.id}
          hint={h}
          problemId={problemId}
          onUpdate={(fd) => runAction(updateHintAction, fd)}
          onDelete={(fd) => runAction(deleteHintAction, fd)}
          disabled={isPending}
        />
      ))}

      {hints.length === 0 && <p className="text-sm text-muted">No hints yet.</p>}

      <div className="flex gap-2 pt-2">
        <input
          value={newHintText}
          onChange={(e) => setNewHintText(e.target.value)}
          placeholder="Add a new hint..."
          className={inputClass}
        />
        <Button type="button" variant="secondary" onClick={handleAdd} disabled={isPending}>
          Add
        </Button>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

function HintRow({
  hint,
  problemId,
  onUpdate,
  onDelete,
  disabled,
}: {
  hint: Hint;
  problemId: string;
  onUpdate: (fd: FormData) => void;
  onDelete: (fd: FormData) => void;
  disabled: boolean;
}) {
  const [text, setText] = useState(hint.content);
  const dirty = text !== hint.content;

  return (
    <div className="flex items-start gap-2">
      <span className="mt-2 font-mono text-sm text-muted">{hint.order}.</span>
      <input value={text} onChange={(e) => setText(e.target.value)} className={inputClass} />
      {dirty && (
        <Button
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={() => {
            const fd = new FormData();
            fd.set("hintId", hint.id);
            fd.set("problemId", problemId);
            fd.set("content", text);
            onUpdate(fd);
          }}
        >
          Save
        </Button>
      )}
      <Button
        type="button"
        variant="danger"
        disabled={disabled}
        onClick={() => {
          const fd = new FormData();
          fd.set("hintId", hint.id);
          fd.set("problemId", problemId);
          onDelete(fd);
        }}
      >
        Delete
      </Button>
    </div>
  );
}