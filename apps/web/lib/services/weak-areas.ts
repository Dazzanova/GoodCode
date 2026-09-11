import { prisma } from "@/lib/db/prisma";

const MASTERY_THRESHOLD = 70;

export type WeakArea = {
  pattern: { name: string; slug: string };
  mastery: number;
  solvedCount: number;
  totalCount: number;
  unsolvedProblems: { id: string; title: string; slug: string; difficulty: string }[];
};

/**
 * Surfaces patterns the user has engaged with but hasn't mastered yet.
 * A pattern only counts as "weak" if the user has attempted at least one
 * problem in it — patterns never touched at all aren't weaknesses, they're
 * just unstarted, and belong on Daily Practice's "new" tier instead.
 */
export async function getWeakAreas(userId: string): Promise<WeakArea[]> {
  const patterns = await prisma.pattern.findMany({
    select: {
      name: true,
      slug: true,
      problems: {
        select: {
          problem: {
            select: { id: true, title: true, slug: true, difficulty: true, published: true },
          },
        },
      },
    },
  });

  const solvedProblemIds = new Set(
    (
      await prisma.problemProgress.findMany({
        where: { userId, status: "SOLVED" },
        select: { problemId: true },
      })
    ).map((p) => p.problemId)
  );

  const attemptedProblemIds = new Set(
    (
      await prisma.problemProgress.findMany({
        where: { userId },
        select: { problemId: true },
      })
    ).map((p) => p.problemId)
  );

  const weakAreas: WeakArea[] = [];

  for (const pattern of patterns) {
    const problems = pattern.problems.map((pp) => pp.problem).filter((p) => p.published);
    if (problems.length === 0) continue;

    const hasAttempted = problems.some((p) => attemptedProblemIds.has(p.id));
    if (!hasAttempted) continue;

    const solvedCount = problems.filter((p) => solvedProblemIds.has(p.id)).length;
    const mastery = Math.round((solvedCount / problems.length) * 100);

    if (mastery >= MASTERY_THRESHOLD) continue;

    const unsolvedProblems = problems.filter((p) => !solvedProblemIds.has(p.id));

    weakAreas.push({
      pattern: { name: pattern.name, slug: pattern.slug },
      mastery,
      solvedCount,
      totalCount: problems.length,
      unsolvedProblems,
    });
  }

  return weakAreas.sort((a, b) => a.mastery - b.mastery);
}