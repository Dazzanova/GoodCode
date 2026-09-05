import { z } from "zod";

export const createSubmissionSchema = z.object({
  problemId: z.string().cuid(),
  code: z.string().trim().min(1, "Code cannot be empty").max(20000),
  language: z.enum(["cpp", "python", "java", "javascript"]),
  timeSpentS: z.number().int().min(0).max(60 * 60 * 6),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;