// app/problems/[slug]/actions.ts
"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createSubmissionSchema } from "@/lib/validations/submission";
import { createSubmission } from "@/lib/services/submissions";
import { upsertNoteSchema } from "@/lib/validations/note";
import { upsertNote } from "@/lib/services/notes";

export async function submitSolution(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to submit.");
  }
  const parsed = createSubmissionSchema.safeParse({
    problemId: formData.get("problemId"),
    code: formData.get("code"),
    language: formData.get("language"),
    timeSpentS: Number(formData.get("timeSpentS")),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid submission");
  }

  await createSubmission(session.user.id, parsed.data);

  const slug = formData.get("slug");
  if (typeof slug === "string") {
    revalidatePath(`/problems/${slug}`);
  }
}

export async function saveNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to save notes.");
  }

  const parsed = upsertNoteSchema.safeParse({
    problemId: formData.get("problemId"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid note");
  }

  await upsertNote(session.user.id, parsed.data);

  const slug = formData.get("slug");
  if (typeof slug === "string") {
    revalidatePath(`/problems/${slug}`);
  }
}