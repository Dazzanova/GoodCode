import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDailyPractice } from "@/lib/services/daily-practice";
import { prisma } from "@/lib/db/prisma";
import { DifficultyBadge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [picks, solvedCount, dueCount] = await Promise.all([
    getDailyPractice(session.user.id, 5),
    prisma.problemProgress.count({
      where: { userId: session.user.id, status: "SOLVED" },
    }),
    prisma.problemProgress.count({
      where: { userId: session.user.id, status: "SOLVED", nextReviewAt: { lte: new Date() } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">
        Welcome back{session.user.name ? `, ${session.user.name}` : ""}
      </h1>

      <div className="mt-6 flex gap-8 text-sm">
        <div>
          <p className="text-muted">Solved</p>
          <p className="mt-1 font-mono text-xl font-semibold text-foreground">{solvedCount}</p>
        </div>
        <div>
          <p className="text-muted">Needs Review</p>
          <p className="mt-1 font-mono text-xl font-semibold text-foreground">{dueCount}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium text-muted">Today&apos;s Practice</h2>

        {picks.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No picks available — try browsing problems directly.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {picks.map((pick) => (
              <Link
                key={pick.problem.id}
                href={`/problems/${pick.problem.slug}`}
                className="block rounded-lg border border-border p-4 hover:border-accent/40 hover:bg-surface"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{pick.problem.title}</span>
                  <DifficultyBadge difficulty={pick.problem.difficulty} />
                </div>
                <p className="mt-1 text-sm text-muted">{pick.reason}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
