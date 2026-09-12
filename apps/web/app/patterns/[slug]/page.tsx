import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPatternBySlug } from "@/lib/services/patterns";
import { DifficultyBadge } from "@/components/ui/badge";

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
      <h1 className="text-2xl font-semibold text-foreground">{pattern.name}</h1>
      {pattern.description && (
        <p className="mt-2 text-sm text-muted">{pattern.description}</p>
      )}

      {session?.user ? (
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Mastery</span>
            <span className="font-mono text-foreground">{pattern.mastery}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-surface">
            <div
              className="h-1.5 rounded-full bg-success"
              style={{ width: `${pattern.mastery}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">
          Sign in to track your mastery for this pattern.
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {pattern.problems.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/problems/${p.slug}`} className="text-foreground hover:text-accent">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={p.difficulty} />
                </td>
                <td className="px-4 py-3">
                  {p.solved ? (
                    <span className="text-success">Solved</span>
                  ) : (
                    <span className="text-muted">—</span>
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