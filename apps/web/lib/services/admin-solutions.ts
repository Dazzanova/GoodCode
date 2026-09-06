// lib/services/admin-solutions.ts
import { prisma } from "@/lib/db/prisma";
import type { UpsertSolutionInput } from "@/lib/validations/admin-solution";

export async function getSolutionForProblem(problemId: string) {
  return prisma.solution.findUnique({ where: { problemId } });
}

export async function upsertSolution(input: UpsertSolutionInput) {
  const { problemId, editorial, codeSnippet } = input;

  return prisma.solution.upsert({
    where: { problemId },
    create: { problemId, editorial, codeSnippet },
    update: { editorial, codeSnippet },
  });
}