import { prisma } from "@/lib/db/prisma";
import type { UpsertProblemInput } from "@/lib/validations/admin-problem";

export async function getAllProblemsForAdmin() {
  return prisma.problem.findMany({
    select: {
      id: true, title: true, slug: true, difficulty: true,
      published: true, topic: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProblemForEdit(id: string) {
  return prisma.problem.findUnique({ where: { id } });
}

export async function getAllTopics() {
  return prisma.topic.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
}

export async function createProblem(input: UpsertProblemInput) {
  return prisma.problem.create({ data: input });
}

export async function updateProblem(id: string, input: UpsertProblemInput) {
  return prisma.problem.update({ where: { id }, data: input });
}