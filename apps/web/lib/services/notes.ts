// lib/services/notes.ts
import { prisma } from "@/lib/db/prisma";
import type { UpsertNoteInput } from "@/lib/validations/note";

export async function getNoteForProblem(userId: string, problemId: string) {
  return prisma.note.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });
}

export async function upsertNote(userId: string, input: UpsertNoteInput) {
  const { problemId, content } = input;

  if (content.length === 0) {
    // Empty save clears the note rather than storing a blank row.
    await prisma.note.deleteMany({ where: { userId, problemId } });
    return null;
  }

  return prisma.note.upsert({
    where: { userId_problemId: { userId, problemId } },
    create: { userId, problemId, content },
    update: { content },
  });
}