import { prisma } from "@/lib/db/prisma";
import type { CreateSubmissionInput } from "@/lib/validations/submission";
import { computeReviewIntervalDays } from "@/lib/scheduling";

export async function createSubmission(userId: string, input: CreateSubmissionInput) {
  const { problemId, code, language, timeSpentS } = input;

  return prisma.$transaction(async (tx) => {
    const submission = await tx.submission.create({
      data: { userId, problemId, code, language, status: "ACCEPTED", timeSpentS },
    });

    const existing = await tx.problemProgress.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    const newAttempts = (existing?.attempts ?? 0) + 1;
    const now = new Date();
    const intervalDays = computeReviewIntervalDays(newAttempts);
    const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

    await tx.problemProgress.upsert({
      where: { userId_problemId: { userId, problemId } },
      create: {
        userId,
        problemId,
        status: "SOLVED",
        attempts: 1,
        firstAttemptAt: now,
        lastAttemptAt: now,
        solvedAt: now,
        nextReviewAt,
      },
      update: {
        attempts: { increment: 1 },
        lastAttemptAt: now,
        status: "SOLVED",
        solvedAt: existing?.solvedAt ?? now,
        nextReviewAt,
      },
    });

    return submission;
  });
}