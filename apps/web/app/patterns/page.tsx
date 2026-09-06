import Link from "next/link";
import { getAllPatternsWithCounts } from "@/lib/services/patterns";

export default async function PatternsPage() {
  const patterns = await getAllPatternsWithCounts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-100">Patterns</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Recognize the pattern, not just the problem.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {patterns.map((p) => (
          <Link
            key={p.id}
            href={`/patterns/${p.slug}`}
            className="rounded-lg border border-zinc-800 p-4 hover:border-zinc-700 hover:bg-zinc-900/50"
          >
            <h2 className="font-medium text-zinc-200">{p.name}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {p._count.problems} problem{p._count.problems !== 1 ? "s" : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}