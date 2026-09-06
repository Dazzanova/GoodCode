// lib/validations/admin-solution.ts
import { z } from "zod";

export const upsertSolutionSchema = z.object({
  problemId: z.string().cuid(),
  editorial: z.string().trim().min(10).max(5000),
  codeSnippet: z.string().trim().max(5000).optional(),
});

export type UpsertSolutionInput = z.infer<typeof upsertSolutionSchema>;