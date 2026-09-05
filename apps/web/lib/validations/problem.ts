// lib/validations/problem.ts
import { z } from "zod";
import { Difficulty } from "@prisma/client";

export const problemFiltersSchema = z.object({
  search: z.string().trim().max(100).optional(),
  topicSlug: z.string().trim().optional(),
  patternSlug: z.string().trim().optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export type ProblemFilters = z.infer<typeof problemFiltersSchema>;