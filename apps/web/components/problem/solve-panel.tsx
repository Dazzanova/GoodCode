"use client";

import { useEffect, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { submitSolution } from "@/app/problems/[slug]/actions";
import { Button } from "@/components/ui/button";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const STARTER_CPP = `class Solution {
public:
    // write your solution here
};`;

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
      <div className="mt-10 rounded-lg border border-border p-6 text-center text-sm text-muted">
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
    <div className="mt-10 border-t border-border pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted">Solve</h2>
        <span className="font-mono text-sm text-muted">{formatTime(seconds)}</span>
      </div>

      <form action={handleSubmit} className="mt-4 space-y-3">
        <input type="hidden" name="problemId" value={problemId} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="language" value="cpp" />
        <input type="hidden" name="timeSpentS" value={seconds} />
        <input type="hidden" name="code" value={code} />

        <div className="overflow-hidden rounded-md border border-border">
          <MonacoEditor
            height="360px"
            language="cpp"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={{
              fontSize: 14,
              fontFamily: "var(--font-geist-mono)",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 16 },
            }}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}