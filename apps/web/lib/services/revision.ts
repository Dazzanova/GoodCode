import { prisma } from "@/lib/db/prisma";

export async function getRevisionQueue(userId: string) {
  const now = new Date();

  const [due, upcoming, unsolvedCount] = await Promise.all([
    prisma.problemProgress.findMany({
      where: { userId, status: "SOLVED", nextReviewAt: { lte: now } },
      orderBy: { nextReviewAt: "asc" },
      select: {
        attempts: true,
        solvedAt: true,
        nextReviewAt: true,
        problem: { select: { id: true, title: true, slug: true, difficulty: true } },
      },
    }),
    prisma.problemProgress.findMany({
      where: { userId, status: "SOLVED", nextReviewAt: { gt: now } },
      orderBy: { nextReviewAt: "asc" },
      select: {
        attempts: true,
        solvedAt: true,
        nextReviewAt: true,
        problem: { select: { id: true, title: true, slug: true, difficulty: true } },
      },
    }),
    prisma.problem.count({
      where: {
        published: true,
        progress: { none: { userId } },
      },
    }),
  ]);

  return { due, upcoming, unsolvedCount };
}