import { z } from "zod";

export const createHintSchema = z.object({
  problemId: z.string().cuid(),
  content: z.string().trim().min(3).max(1000),
});

export const updateHintSchema = z.object({
  hintId: z.string().cuid(),
  content: z.string().trim().min(3).max(1000),
});

export const deleteHintSchema = z.object({
  hintId: z.string().cuid(),
});

export type CreateHintInput = z.infer<typeof createHintSchema>;
export type UpdateHintInput = z.infer<typeof updateHintSchema>;