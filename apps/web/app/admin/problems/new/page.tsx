import { ProblemForm } from "@/components/admin/problem-form";
import { getAllTopics } from "@/lib/services/admin-problems";
import { createProblemAction } from "../actions";

export default async function NewProblemPage() {
  const topics = await getAllTopics();
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-100">New Problem</h1>
      <ProblemForm action={createProblemAction} topics={topics} />
    </div>
  );
}