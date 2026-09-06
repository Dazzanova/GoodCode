import { prisma } from "@/lib/db/prisma";
import type { CreateHintInput, UpdateHintInput } from "@/lib/validations/admin-hint";

export async function getHintsForProblem(problemId: string) {
  return prisma.hint.findMany({
    where: { problemId },
    orderBy: { order: "asc" },
  });
}

export async function createHint(input: CreateHintInput) {
  const { problemId, content } = input;

  const lastHint = await prisma.hint.findFirst({
    where: { problemId },
    orderBy: { order: "desc" },
  });

  const nextOrder = (lastHint?.order ?? 0) + 1;

  return prisma.hint.create({
    data: { problemId, content, order: nextOrder },
  });
}

export async function updateHint(input: UpdateHintInput) {
  return prisma.hint.update({
    where: { id: input.hintId },
    data: { content: input.content },
  });
}

export async function deleteHint(hintId: string) {
  return prisma.hint.delete({ where: { id: hintId } });
}