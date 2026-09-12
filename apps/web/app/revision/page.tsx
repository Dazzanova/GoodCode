import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRevisionQueue } from "@/lib/services/revision";
import { DifficultyBadge } from "@/components/ui/badge";

function formatRelative(date: Date, future: boolean) {
  const days = Math.round(Math.abs(Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  return future ? `in ${days} day${days === 1 ? "" : "s"}` : `${days} day${days === 1 ? "" : "s"} ago`;
}

export default async function RevisionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { due, upcoming, unsolvedCount } = await getRevisionQueue(session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">Revision</h1>
      <p className="mt-1 text-sm text-muted">
        Solving once isn&apos;t learning. Make sure it sticks.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-muted">
          Due Today {due.length > 0 && <span className="font-mono text-muted">({due.length})</span>}
        </h2>

        {due.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nothing due — you&apos;re caught up.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {due.map((p) => (
              <Link
                key={p.problem.id}
                href={`/problems/${p.problem.slug}`}
                className="block rounded-lg border border-border p-4 hover:border-accent/40 hover:bg-surface"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{p.problem.title}</span>
                  <DifficultyBadge difficulty={p.problem.difficulty} />
                </div>
                <p className="mt-1 text-sm text-muted">
                  Solved {p.solvedAt ? formatRelative(p.solvedAt, false) : "previously"} ·{" "}
                  {p.attempts} attempt{p.attempts === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-muted">
          Upcoming {upcoming.length > 0 && <span className="font-mono text-muted">({upcoming.length})</span>}
        </h2>

        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No upcoming reviews scheduled.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {upcoming.map((p) => (
              <Link
                key={p.problem.id}
                href={`/problems/${p.problem.slug}`}
                className="block rounded-lg border border-border p-4 hover:border-accent/40 hover:bg-surface"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{p.problem.title}</span>
                  <DifficultyBadge difficulty={p.problem.difficulty} />
                </div>
                <p className="mt-1 text-sm text-muted">
                  Review {p.nextReviewAt ? formatRelative(p.nextReviewAt, true) : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {unsolvedCount > 0 && (
        <section className="mt-10 border-t border-border pt-6">
          <p className="text-sm text-muted">
            {unsolvedCount} problem{unsolvedCount === 1 ? "" : "s"} you haven&apos;t attempted yet.{" "}
            <Link href="/problems" className="text-accent hover:underline">
              Browse problems
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}