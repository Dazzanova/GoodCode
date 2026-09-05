// components/problem/solve-panel.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { submitSolution } from "@/app/problems/[slug]/actions";

const STARTER_CPP = `class Solution {\npublic:\n    // write your solution here\n};`;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function SolvePanel({
  problemId,
  slug,
  isAuthenticated,
}: {
  problemId: string;
  slug: string;
  isAuthenticated: boolean;
}) {
  const [seconds, setSeconds] = useState(0);
  const [code, setCode] = useState(STARTER_CPP);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="mt-10 rounded-lg border border-zinc-800 p-6 text-center text-sm text-zinc-500">
        Sign in to start solving this problem.
      </div>
    );
  }

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        await submitSolution(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  return (
    <div className="mt-10 border-t border-zinc-800 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-400">Solve</h2>
        <span className="font-mono text-sm text-zinc-500">{formatTime(seconds)}</span>
      </div>

      <form action={handleSubmit} className="mt-4 space-y-3">
        <input type="hidden" name="problemId" value={problemId} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="language" value="cpp" />
        <input type="hidden" name="timeSpentS" value={seconds} />

        <textarea
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={14}
          spellCheck={false}
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
        />

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}