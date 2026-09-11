import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRevisionQueue } from "@/lib/services/revision";

const difficultyColor: Record<string, string> = {
  EASY: "text-emerald-500",
  MEDIUM: "text-amber-500",
  HARD: "text-rose-500",
};

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
      <h1 className="text-2xl font-semibold text-zinc-100">Revision</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Solving once isn&apos;t learning. Make sure it sticks.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-zinc-400">
          Due Today {due.length > 0 && <span className="text-zinc-600">({due.length})</span>}
        </h2>

        {due.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">Nothing due — you&apos;re caught up.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {due.map((p) => (
              <Link
                key={p.problem.id}
                href={`/problems/${p.problem.slug}`}
                className="block rounded-lg border border-zinc-800 p-4 hover:border-zinc-700 hover:bg-zinc-900/50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-200">{p.problem.title}</span>
                  <span className={`text-xs font-medium ${difficultyColor[p.problem.difficulty]}`}>
                    {p.problem.difficulty}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  Solved {p.solvedAt ? formatRelative(p.solvedAt, false) : "previously"} ·{" "}
                  {p.attempts} attempt{p.attempts === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-zinc-400">
          Upcoming {upcoming.length > 0 && <span className="text-zinc-600">({upcoming.length})</span>}
        </h2>

        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">No upcoming reviews scheduled.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {upcoming.map((p) => (
              <Link
                key={p.problem.id}
                href={`/problems/${p.problem.slug}`}
                className="block rounded-lg border border-zinc-800 p-4 hover:border-zinc-700 hover:bg-zinc-900/50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-200">{p.problem.title}</span>
                  <span className={`text-xs font-medium ${difficultyColor[p.problem.difficulty]}`}>
                    {p.problem.difficulty}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  Review {p.nextReviewAt ? formatRelative(p.nextReviewAt, true) : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {unsolvedCount > 0 && (
        <section className="mt-10 border-t border-zinc-800 pt-6">
          <p className="text-sm text-zinc-500">
            {unsolvedCount} problem{unsolvedCount === 1 ? "" : "s"} you haven&apos;t attempted yet.{" "}
            <Link href="/problems" className="text-zinc-300 hover:text-zinc-100">
              Browse problems →
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}