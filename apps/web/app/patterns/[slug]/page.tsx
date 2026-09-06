import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPatternBySlug } from "@/lib/services/patterns";

const difficultyColor: Record<string, string> = {
  EASY: "text-emerald-500",
  MEDIUM: "text-amber-500",
  HARD: "text-rose-500",
};

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const pattern = await getPatternBySlug(slug, session?.user?.id);

  if (!pattern) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-100">{pattern.name}</h1>
      {pattern.description && (
        <p className="mt-2 text-sm text-zinc-400">{pattern.description}</p>
      )}

      {session?.user ? (
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Mastery</span>
            <span className="text-zinc-300">{pattern.mastery}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-800">
            <div
              className="h-1.5 rounded-full bg-emerald-500"
              style={{ width: `${pattern.mastery}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-zinc-600">
          Sign in to track your mastery for this pattern.
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {pattern.problems.map((p) => (
              <tr key={p.id} className="border-b border-zinc-800/50 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/problems/${p.slug}`} className="text-zinc-200 hover:text-zinc-50">
                    {p.title}
                  </Link>
                </td>
                <td className={`px-4 py-3 font-medium ${difficultyColor[p.difficulty]}`}>
                  {p.difficulty}
                </td>
                <td className="px-4 py-3">
                  {p.solved ? (
                    <span className="text-emerald-500">Solved</span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}