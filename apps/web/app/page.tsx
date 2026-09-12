import Link from "next/link";
import { Button } from "@/components/ui/button";

const samplePatterns = ["Two Pointers", "Sliding Window", "Hashing", "Backtracking"];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Practice with intent.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        Recognize the pattern, think before you look at the answer, and
        actually remember what you solve.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {samplePatterns.map((p) => (
          <span
            key={p}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
          >
            {p}
          </span>
        ))}
      </div>

      <Link href="/problems" className="mt-10">
        <Button variant="primary">Browse Problems</Button>
      </Link>
    </main>
  );
}