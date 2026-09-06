import { prisma } from "@/lib/db/prisma";
import type { CreateMCQInput } from "@/lib/validations/admin-mcq";

export async function getMCQsForProblemAdmin(problemId: string) {
  return prisma.mCQ.findMany({
    where: { problemId },
    select: {
      id: true,
      question: true,
      options: { select: { id: true, text: true, isCorrect: true } },
    },
  });
}

export async function createMCQ(input: CreateMCQInput) {
  const { problemId, question, options } = input;

  return prisma.mCQ.create({
    data: {
      problemId,
      question,
      options: { create: options },
    },
  });
}

export async function deleteMCQ(mcqId: string) {
  // Options cascade via the relation — deleting the MCQ removes its options too,
  // but only if the schema has onDelete: Cascade. We delete explicitly here
  // instead of relying on that, since the current schema doesn't declare it.
  await prisma.mCQOption.deleteMany({ where: { mcqId } });
  return prisma.mCQ.delete({ where: { id: mcqId } });
}