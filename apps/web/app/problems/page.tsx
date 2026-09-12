import Link from "next/link";
import { getPublishedProblems, getFilterOptions } from "@/lib/services/problems";
import { problemFiltersSchema } from "@/lib/validations/problem";
import { ProblemFilters } from "@/components/problem/problem-filters";
import { DifficultyBadge } from "@/components/ui/badge";

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const filters = problemFiltersSchema.parse(params);

  const [{ problems, total, page, totalPages }, { topics, patterns }] = await Promise.all([
    getPublishedProblems(filters),
    getFilterOptions(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">Problems</h1>
      <p className="mt-1 text-sm text-muted">{total} problems available</p>

      <ProblemFilters topics={topics} patterns={patterns} />

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Topic</th>
              <th className="px-4 py-3 font-medium">Pattern</th>
              <th className="px-4 py-3 font-medium">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border/60 last:border-0 hover:bg-surface"
              >
                <td className="px-4 py-3">
                  <Link href={`/problems/${p.slug}`} className="text-foreground hover:text-accent">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{p.topic.name}</td>
                <td className="px-4 py-3 text-muted">
                  {p.patterns.map((pp) => pp.pattern.name).join(", ")}
                </td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={p.difficulty} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {problems.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted">
            No problems match these filters.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <p className="mt-4 text-sm text-muted">
          Page {page} of {totalPages}
        </p>
      )}
    </div>
  );
}