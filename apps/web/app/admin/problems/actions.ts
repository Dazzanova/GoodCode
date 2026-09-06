"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { upsertProblemSchema } from "@/lib/validations/admin-problem";
import { createProblem, updateProblem } from "@/lib/services/admin-problems";
import { upsertSolutionSchema } from "@/lib/validations/admin-solution";
import { upsertSolution } from "@/lib/services/admin-solutions";
import { createHintSchema, updateHintSchema, deleteHintSchema } from "@/lib/validations/admin-hint";
import { createHint, updateHint, deleteHint } from "@/lib/services/admin-hints";
import { createMCQSchema, deleteMCQSchema } from "@/lib/validations/admin-mcq";
import { createMCQ, deleteMCQ } from "@/lib/services/admin-mcqs";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required.");
  }
}

function parseForm(formData: FormData) {
  const parsed = upsertProblemSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    constraints: formData.get("constraints") || undefined,
    difficulty: formData.get("difficulty"),
    topicId: formData.get("topicId"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid problem data");
  }

  return parsed.data;
}

export async function createProblemAction(formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await createProblem(data);
  revalidatePath("/admin/problems");
  redirect("/admin/problems");
}

export async function updateProblemAction(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await updateProblem(id, data);
  revalidatePath("/admin/problems");
  redirect("/admin/problems");
}

export async function upsertSolutionAction(formData: FormData) {
  await requireAdmin();

  const parsed = upsertSolutionSchema.safeParse({
    problemId: formData.get("problemId"),
    editorial: formData.get("editorial"),
    codeSnippet: formData.get("codeSnippet") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid solution data");
  }

  await upsertSolution(parsed.data);

  const problemId = formData.get("problemId");
  revalidatePath(`/admin/problems/${problemId}/edit`);
}

export async function createHintAction(formData: FormData) {
  await requireAdmin();

  const parsed = createHintSchema.safeParse({
    problemId: formData.get("problemId"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid hint");
  }

  await createHint(parsed.data);
  revalidatePath(`/admin/problems/${parsed.data.problemId}/edit`);
}

export async function updateHintAction(formData: FormData) {
  await requireAdmin();

  const parsed = updateHintSchema.safeParse({
    hintId: formData.get("hintId"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid hint");
  }

  await updateHint(parsed.data);

  const problemId = formData.get("problemId");
  if (typeof problemId === "string") {
    revalidatePath(`/admin/problems/${problemId}/edit`);
  }
}

export async function deleteHintAction(formData: FormData) {
  await requireAdmin();

  const parsed = deleteHintSchema.safeParse({
    hintId: formData.get("hintId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid hint id");
  }

  await deleteHint(parsed.data.hintId);

  const problemId = formData.get("problemId");
  if (typeof problemId === "string") {
    revalidatePath(`/admin/problems/${problemId}/edit`);
  }
}

export async function createMCQAction(formData: FormData) {
  await requireAdmin();

  const optionsRaw = formData.get("optionsJson");
  const options = typeof optionsRaw === "string" ? JSON.parse(optionsRaw) : [];

  const parsed = createMCQSchema.safeParse({
    problemId: formData.get("problemId"),
    question: formData.get("question"),
    options,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid MCQ");
  }

  await createMCQ(parsed.data);

  const problemId = formData.get("problemId");
  if (typeof problemId === "string") {
    revalidatePath(`/admin/problems/${problemId}/edit`);
  }
}

export async function deleteMCQAction(formData: FormData) {
  await requireAdmin();

  const parsed = deleteMCQSchema.safeParse({ mcqId: formData.get("mcqId") });
  if (!parsed.success) {
    throw new Error("Invalid MCQ id");
  }

  await deleteMCQ(parsed.data.mcqId);

  const problemId = formData.get("problemId");
  if (typeof problemId === "string") {
    revalidatePath(`/admin/problems/${problemId}/edit`);
  }
}