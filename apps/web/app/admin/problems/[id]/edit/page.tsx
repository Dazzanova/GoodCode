import { notFound } from "next/navigation";
import { ProblemForm } from "@/components/admin/problem-form";
import { getAllTopics, getProblemForEdit } from "@/lib/services/admin-problems";
import { updateProblemAction } from "../../actions";

export default async function EditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [problem, topics] = await Promise.all([getProblemForEdit(id), getAllTopics()]);

  if (!problem) notFound();

  const boundAction = updateProblemAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-100">Edit Problem</h1>
      <ProblemForm action={boundAction} topics={topics} defaults={problem} />
    </div>
  );
}