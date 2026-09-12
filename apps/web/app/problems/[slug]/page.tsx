import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getProblemBySlug } from "@/lib/services/problems";
import { getNoteForProblem } from "@/lib/services/notes";
import { getMCQsForProblem } from "@/lib/services/mcqs";
import { SolvePanel } from "@/components/problem/solve-panel";
import { NotePanel } from "@/components/problem/note-panel";
import { MCQPanel } from "@/components/problem/mcq-panel";
import { DifficultyBadge } from "@/components/ui/badge";

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const problem = await getProblemBySlug(slug, session?.user?.id);

  if (!problem) notFound();

  const existingNote = session?.user?.id
    ? await getNoteForProblem(session.user.id, problem.id)
    : null;

  const mcqs = await getMCQsForProblem(problem.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">{problem.title}</h1>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <p className="mt-1 text-sm text-muted">
        {problem.topic.name} · {problem.patterns.map((p) => p.pattern.name).join(", ")}
      </p>

      <div className="mt-8 space-y-4 text-foreground">
        <p>{problem.description}</p>
        {problem.constraints && (
          <div>
            <h2 className="text-sm font-medium text-muted">Constraints</h2>
            <p className="mt-1 text-sm text-muted">{problem.constraints}</p>
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

      <div className="mt-6 border-t border-border pt-6">
        <h2 className="text-sm font-medium text-muted">Hints</h2>

        {!session?.user ? (
          <p className="mt-2 text-sm text-muted">
            Sign in and make an attempt to unlock hints.
          </p>
        ) : !problem.hasAttempted ? (
          <p className="mt-2 text-sm text-muted">
            Try the problem first. Understanding comes before the answer.
          </p>
        ) : problem.hints.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No hints available.</p>
        ) : (
          <ol className="mt-2 space-y-2 text-sm text-foreground">
            {problem.hints.map((h) => (
              <li key={h.id}>
                <span className="text-muted">{h.order}.</span> {h.content}
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h2 className="text-sm font-medium text-muted">Solution</h2>

        {!problem.hasAttempted ? (
          <p className="mt-2 text-sm text-muted">Locked until you submit an attempt.</p>
        ) : problem.solution ? (
          <div className="mt-2 space-y-3">
            <p className="text-sm text-foreground">{problem.solution.editorial}</p>
            {problem.solution.codeSnippet && (
              <pre className="overflow-x-auto rounded-md bg-surface p-4 font-mono text-xs text-foreground">
                <code>{problem.solution.codeSnippet}</code>
              </pre>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">No solution available.</p>
        )}
      </div>

      <MCQPanel mcqs={mcqs} />
    </div>
  );
}