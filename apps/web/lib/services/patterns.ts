import { prisma } from "@/lib/db/prisma";

export async function getAllPatternsWithCounts() {
  const patterns = await prisma.pattern.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: { select: { problems: true } },
    },
    orderBy: { name: "asc" },
  });

  return patterns.filter((p) => p._count.problems > 0);
}

export async function getPatternBySlug(slug: string, userId?: string) {
  const pattern = await prisma.pattern.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      problems: {
        select: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
              published: true,
            },
          },
        },
      },
    },
  });

  if (!pattern) return null;

  const problems = pattern.problems
    .map((pp) => pp.problem)
    .filter((p) => p.published);

  let solvedProblemIds = new Set<string>();

  if (userId && problems.length > 0) {
    const progress = await prisma.problemProgress.findMany({
      where: {
        userId,
        problemId: { in: problems.map((p) => p.id) },
        status: "SOLVED",
      },
      select: { problemId: true },
    });
    solvedProblemIds = new Set(progress.map((p) => p.problemId));
  }

  const mastery =
    problems.length === 0
      ? 0
      : Math.round((solvedProblemIds.size / problems.length) * 100);

  return {
    id: pattern.id,
    name: pattern.name,
    slug: pattern.slug,
    description: pattern.description,
    problems: problems.map((p) => ({
      ...p,
      solved: solvedProblemIds.has(p.id),
    })),
    mastery,
  };
}