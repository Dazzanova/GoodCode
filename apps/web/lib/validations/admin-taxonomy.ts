import { z } from "zod";

export const createTopicSchema = z.object({
  name: z.string().trim().min(2).max(50),
});

export const createPatternSchema = z.object({
  name: z.string().trim().min(2).max(50),
  description: z.string().trim().max(500).optional(),
});