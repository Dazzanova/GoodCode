import { notFound } from "next/navigation";
import { ProblemForm } from "@/components/admin/problem-form";
import { SolutionForm } from "@/components/admin/solution-form";
import { HintsManager } from "@/components/admin/hints-manager";
import { MCQsManager } from "@/components/admin/mcqs-manager";
import { getAllTopics, getProblemForEdit } from "@/lib/services/admin-problems";
import { getSolutionForProblem } from "@/lib/services/admin-solutions";
import { getHintsForProblem } from "@/lib/services/admin-hints";
import { getMCQsForProblemAdmin } from "@/lib/services/admin-mcqs";
import { updateProblemAction } from "../../actions";

export default async function EditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [problem, topics, solution, hints, mcqs] = await Promise.all([
    getProblemForEdit(id),
    getAllTopics(),
    getSolutionForProblem(id),
    getHintsForProblem(id),
    getMCQsForProblemAdmin(id),
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

      <div className="mt-10 border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-medium text-zinc-100">Hints</h2>
        <HintsManager problemId={problem.id} hints={hints} />
      </div>

      <div className="mt-10 border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-medium text-zinc-100">MCQs</h2>
        <MCQsManager problemId={problem.id} mcqs={mcqs} />
      </div>
    </div>
  );
}