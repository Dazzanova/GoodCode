import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getWeakAreas } from "@/lib/services/weak-areas";
import { DifficultyBadge } from "@/components/ui/badge";

export default async function WeakAreasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const weakAreas = await getWeakAreas(session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">Weak Areas</h1>
      <p className="mt-1 text-sm text-muted">
        Patterns worth another pass before you call them done.
      </p>

      {weakAreas.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          No weak areas yet — either you&apos;re solid across everything you&apos;ve tried, or you haven&apos;t started enough patterns to tell.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {weakAreas.map((area) => (
            <div key={area.pattern.slug} className="rounded-lg border border-border p-5">
              <div className="flex items-center justify-between">
                <Link
                  href={`/patterns/${area.pattern.slug}`}
                  className="font-medium text-foreground hover:text-accent"
                >
                  {area.pattern.name}
                </Link>
                <span className="font-mono text-sm text-muted">
                  {area.solvedCount}/{area.totalCount} · {area.mastery}%
                </span>
              </div>

              <div className="mt-2 h-1.5 w-full rounded-full bg-surface">
                <div
                  className="h-1.5 rounded-full bg-warning"
                  style={{ width: `${area.mastery}%` }}
                />
              </div>

              {area.unsolvedProblems.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  {area.unsolvedProblems.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      href={`/problems/${p.slug}`}
                      className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:border-accent/40 hover:bg-surface"
                    >
                      <span className="text-foreground">{p.title}</span>
                      <DifficultyBadge difficulty={p.difficulty} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}