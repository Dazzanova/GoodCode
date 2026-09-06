// app/admin/problems/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { ProblemForm } from "@/components/admin/problem-form";
import { SolutionForm } from "@/components/admin/solution-form";
import { getAllTopics, getProblemForEdit } from "@/lib/services/admin-problems";
import { getSolutionForProblem } from "@/lib/services/admin-solutions";
import { updateProblemAction } from "../../actions";

export default async function EditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [problem, topics, solution] = await Promise.all([
    getProblemForEdit(id),
    getAllTopics(),
    getSolutionForProblem(id),
  ]);

  if (!problem) notFound();

  const boundAction = updateProblemAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-100">Edit Problem</h1>
      <ProblemForm action={boundAction} topics={topics} defaults={problem} />

      <div className="mt-10 border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-medium text-zinc-100">Solution</h2>
        <SolutionForm problemId={problem.id} defaults={solution} />
      </div>
    </div>
  );
}