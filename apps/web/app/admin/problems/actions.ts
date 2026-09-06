"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { upsertProblemSchema } from "@/lib/validations/admin-problem";
import { createProblem, updateProblem } from "@/lib/services/admin-problems";
import { upsertSolutionSchema } from "@/lib/validations/admin-solution";
import { upsertSolution } from "@/lib/services/admin-solutions";

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