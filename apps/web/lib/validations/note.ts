// lib/validations/note.ts
import { z } from "zod";

export const upsertNoteSchema = z.object({
  problemId: z.string().cuid(),
  content: z.string().trim().max(5000),
});

export type UpsertNoteInput = z.infer<typeof upsertNoteSchema>;