import Link from "next/link";
import { getAllPatternsWithCounts } from "@/lib/services/patterns";

export default async function PatternsPage() {
  const patterns = await getAllPatternsWithCounts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">Patterns</h1>
      <p className="mt-1 text-sm text-muted">
        Recognize the pattern, not just the problem.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {patterns.map((p) => (
          <Link
            key={p.id}
            href={`/patterns/${p.slug}`}
            className="rounded-lg border border-border p-4 hover:border-accent/40 hover:bg-surface"
          >
            <h2 className="font-medium text-foreground">{p.name}</h2>
            <p className="mt-1 text-sm text-muted">
              {p._count.problems} problem{p._count.problems !== 1 ? "s" : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}