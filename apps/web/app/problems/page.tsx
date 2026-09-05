// app/problems/page.tsx
import Link from "next/link";
import { getPublishedProblems } from "@/lib/services/problems";
import { problemFiltersSchema } from "@/lib/validations/problem";

const difficultyColor: Record<string, string> = {
  EASY: "text-emerald-500",
  MEDIUM: "text-amber-500",
  HARD: "text-rose-500",
};

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const filters = problemFiltersSchema.parse(params);
  const { problems, total, page, totalPages } = await getPublishedProblems(filters);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-100">Problems</h1>
      <p className="mt-1 text-sm text-zinc-500">{total} problems available</p>

      <div className="mt-8 overflow-hidden rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-500">
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
                className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/problems/${p.slug}`}
                    className="text-zinc-200 hover:text-zinc-50"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-500">{p.topic.name}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {p.patterns.map((pp) => pp.pattern.name).join(", ")}
                </td>
                <td className={`px-4 py-3 font-medium ${difficultyColor[p.difficulty]}`}>
                  {p.difficulty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <p className="mt-4 text-sm text-zinc-500">
          Page {page} of {totalPages}
        </p>
      )}
    </div>
  );
}