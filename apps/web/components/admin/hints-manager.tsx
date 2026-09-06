"use client";

import { useState, useTransition } from "react";
import {
  createHintAction,
  updateHintAction,
  deleteHintAction,
} from "@/app/admin/problems/actions";

type Hint = { id: string; order: number; content: string };

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

      {hints.length === 0 && (
        <p className="text-sm text-zinc-600">No hints yet.</p>
      )}

      <div className="flex gap-2 pt-2">
        <input
          value={newHintText}
          onChange={(e) => setNewHintText(e.target.value)}
          placeholder="Add a new hint..."
          className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending}
          className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}
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
      <span className="mt-2 text-sm text-zinc-600">{hint.order}.</span>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-200"
      />
      {dirty && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            const fd = new FormData();
            fd.set("hintId", hint.id);
            fd.set("problemId", problemId);
            fd.set("content", text);
            onUpdate(fd);
          }}
          className="rounded-md border border-zinc-700 px-2 py-2 text-xs text-zinc-300 hover:bg-zinc-900 disabled:opacity-50"
        >
          Save
        </button>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          const fd = new FormData();
          fd.set("hintId", hint.id);
          fd.set("problemId", problemId);
          onDelete(fd);
        }}
        className="rounded-md border border-zinc-800 px-2 py-2 text-xs text-rose-500 hover:bg-rose-950/30 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}