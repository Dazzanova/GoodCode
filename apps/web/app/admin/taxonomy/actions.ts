"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createTopicSchema, createPatternSchema } from "@/lib/validations/admin-taxonomy";
import { createTopic, createPattern } from "@/lib/services/admin-taxonomy";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required.");
  }
}

export async function createTopicAction(formData: FormData) {
  await requireAdmin();

  const parsed = createTopicSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid topic");
  }

  await createTopic(parsed.data.name);
  revalidatePath("/admin/taxonomy");
}

export async function createPatternAction(formData: FormData) {
  await requireAdmin();

  const parsed = createPatternSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid pattern");
  }

  await createPattern(parsed.data.name, parsed.data.description);
  revalidatePath("/admin/taxonomy");
}