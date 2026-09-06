import { prisma } from "@/lib/db/prisma";
import type { ProblemFilters } from "@/lib/validations/problem";
import type { Prisma } from "@prisma/client";

export async function getPublishedProblems(filters: ProblemFilters) {
  const { search, topicSlug, patternSlug, difficulty, page, pageSize } = filters;

  const where: Prisma.ProblemWhereInput = {
    published: true,
    ...(search && {
      title: { contains: search, mode: "insensitive" },
    }),
    ...(topicSlug && {
      topic: { slug: topicSlug },
    }),
    ...(patternSlug && {
      patterns: { some: { pattern: { slug: patternSlug } } },
    }),
    ...(difficulty && { difficulty }),
  };

  const [problems, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        topic: { select: { name: true, slug: true } },
        patterns: {
          select: { pattern: { select: { name: true, slug: true } } },
        },
      },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.problem.count({ where }),
  ]);

  return {
    problems,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Fetches a single problem for the problem detail page.
 *
 * Solution/hints/editorial are gated server-side: only returned if the
 * requesting user has at least one submission for this problem.
 * This is intentional per GoodCode's core principle — never send locked
 * content to the client and hide it with CSS. If there's no valid userId,
 * or no submission exists, those fields come back null/empty.
 */
export async function getProblemBySlug(slug: string, userId?: string) {
  const problem = await prisma.problem.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      constraints: true,
      examples: true,
      starterCode: true,
      difficulty: true,
      topic: { select: { name: true, slug: true } },
      patterns: {
        select: { pattern: { select: { name: true, slug: true } } },
      },
    },
  });

  if (!problem) return null;

  const hasAttempted = userId
    ? (await prisma.submission.count({
        where: { userId, problemId: problem.id },
      })) > 0
    : false;

  const [hints, solution] = hasAttempted
    ? await Promise.all([
        prisma.hint.findMany({
          where: { problemId: problem.id },
          orderBy: { order: "asc" },
        }),
        prisma.solution.findUnique({ where: { problemId: problem.id } }),
      ])
    : [[], null];

  return {
    ...problem,
    hasAttempted,
    hints,
    solution,
  };
}

export async function getFilterOptions() {
  const [topics, patterns] = await Promise.all([
    prisma.topic.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
    prisma.pattern.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
  ]);
  return { topics, patterns };
}