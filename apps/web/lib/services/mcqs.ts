import { prisma } from "@/lib/db/prisma";

export async function getMCQsForProblem(problemId: string) {
  return prisma.mCQ.findMany({
    where: { problemId },
    select: {
      id: true,
      question: true,
      options: {
        select: { id: true, text: true, isCorrect: true },
      },
    },
  });
}