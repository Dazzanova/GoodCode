import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getProblemBySlug } from "@/lib/services/problems";
import { SolvePanel } from "@/components/problem/solve-panel";
import { NotePanel } from "@/components/problem/note-panel";
import { getNoteForProblem } from "@/lib/services/notes";
import { MCQPanel } from "@/components/problem/mcq-panel";
import { getMCQsForProblem } from "@/lib/services/mcqs";

const difficultyColor: Record<string, string> = {
  EASY: "text-emerald-500",
  MEDIUM: "text-amber-500",
  HARD: "text-rose-500",
};

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const problem = await getProblemBySlug(slug, session?.user?.id);

  if (!problem) notFound();

  const mcqs = await getMCQsForProblem(problem.id);

  const existingNote = session?.user?.id
    ? await getNoteForProblem(session.user.id, problem.id)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-zinc-100">{problem.title}</h1>
        <span className={`text-sm font-medium ${difficultyColor[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
      </div>

      <p className="mt-1 text-sm text-zinc-500">
        {problem.topic.name} ·{" "}
        {problem.patterns.map((p) => p.pattern.name).join(", ")}
      </p>

      <div className="mt-8 space-y-4 text-zinc-300">
        <p>{problem.description}</p>
        {problem.constraints && (
          <div>
            <h2 className="text-sm font-medium text-zinc-400">Constraints</h2>
            <p className="mt-1 text-sm text-zinc-500">{problem.constraints}</p>
          </div>
        )}
      </div>

        <SolvePanel
        problemId={problem.id}
        slug={problem.slug}
        isAuthenticated={!!session?.user}
        />

        {session?.user && (
        <NotePanel
          problemId={problem.id}
          slug={problem.slug}
          initialContent={existingNote?.content ?? ""}
        />
      )}

      <div className="mt-10 border-t border-zinc-800 pt-6">
        <h2 className="text-sm font-medium text-zinc-400">Hints</h2>

        {!session?.user ? (
          <p className="mt-2 text-sm text-zinc-600">
            🔒 Sign in and make an attempt to unlock hints.
          </p>
        ) : !problem.hasAttempted ? (
          <p className="mt-2 text-sm text-zinc-600">
            🔒 Try the problem first. Understanding comes before the answer.
          </p>
        ) : problem.hints.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">No hints available.</p>
        ) : (
          <ol className="mt-2 space-y-2 text-sm text-zinc-400">
            {problem.hints.map((h) => (
              <li key={h.id}>
                <span className="text-zinc-600">{h.order}.</span> {h.content}
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-6">
        <h2 className="text-sm font-medium text-zinc-400">Solution</h2>

        {!problem.hasAttempted ? (
          <p className="mt-2 text-sm text-zinc-600">🔒 Locked until you submit an attempt.</p>
        ) : problem.solution ? (
          <div className="mt-2 space-y-3">
            <p className="text-sm text-zinc-400">{problem.solution.editorial}</p>
            {problem.solution.codeSnippet && (
              <pre className="overflow-x-auto rounded-md bg-zinc-900 p-4 text-xs text-zinc-300">
                <code>{problem.solution.codeSnippet}</code>
              </pre>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-600">No solution available.</p>
        )}
      </div>
        <MCQPanel mcqs={mcqs} />
    </div>
  );
}