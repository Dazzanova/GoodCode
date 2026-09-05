// lib/services/submissions.ts
import { prisma } from "@/lib/db/prisma";
import type { CreateSubmissionInput } from "@/lib/validations/submission";

export async function createSubmission(userId: string, input: CreateSubmissionInput) {
  const { problemId, code, language, timeSpentS } = input;

  return prisma.$transaction(async (tx) => {
    const submission = await tx.submission.create({
      data: { userId, problemId, code, language, status: "ACCEPTED", timeSpentS },
    });

    const existing = await tx.problemProgress.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    await tx.problemProgress.upsert({
      where: { userId_problemId: { userId, problemId } },
      create: {
        userId,
        problemId,
        status: "SOLVED",
        attempts: 1,
        firstAttemptAt: new Date(),
        lastAttemptAt: new Date(),
        solvedAt: new Date(),
      },
      update: {
        attempts: { increment: 1 },
        lastAttemptAt: new Date(),
        status: "SOLVED",
        solvedAt: existing?.solvedAt ?? new Date(),
      },
    });

    return submission;
  });
}