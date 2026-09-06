import { z } from "zod";
import { Difficulty } from "@prisma/client";

export const upsertProblemSchema = z.object({
  title: z.string().trim().min(3).max(150),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  description: z.string().trim().min(10),
  constraints: z.string().trim().optional(),
  difficulty: z.nativeEnum(Difficulty),
  topicId: z.string().cuid(),
  published: z.boolean().default(false),
});

export type UpsertProblemInput = z.infer<typeof upsertProblemSchema>;