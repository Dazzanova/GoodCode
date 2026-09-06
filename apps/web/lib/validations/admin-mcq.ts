import { z } from "zod";

export const createMCQSchema = z.object({
  problemId: z.string().cuid(),
  question: z.string().trim().min(5).max(500),
  options: z
    .array(
      z.object({
        text: z.string().trim().min(1).max(200),
        isCorrect: z.boolean(),
      })
    )
    .min(2)
    .max(6)
    .refine((opts) => opts.filter((o) => o.isCorrect).length === 1, {
      message: "Exactly one option must be marked correct",
    }),
});

export const deleteMCQSchema = z.object({
  mcqId: z.string().cuid(),
});

export type CreateMCQInput = z.infer<typeof createMCQSchema>;