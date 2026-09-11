import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getWeakAreas } from "@/lib/services/weak-areas";

const difficultyColor: Record<string, string> = {
  EASY: "text-emerald-500",
  MEDIUM: "text-amber-500",
  HARD: "text-rose-500",
};

export default async function WeakAreasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const weakAreas = await getWeakAreas(session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-100">Weak Areas</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Patterns worth another pass before you call them done.
      </p>

      {weakAreas.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-600">
          No weak areas yet — either you're solid across everything you've tried, or you haven't started enough patterns to tell.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {weakAreas.map((area) => (
            <div key={area.pattern.slug} className="rounded-lg border border-zinc-800 p-5">
              <div className="flex items-center justify-between">
                <Link
                  href={`/patterns/${area.pattern.slug}`}
                  className="font-medium text-zinc-200 hover:text-zinc-50"
                >
                  {area.pattern.name}
                </Link>
                <span className="text-sm text-zinc-500">
                  {area.solvedCount}/{area.totalCount} solved · {area.mastery}% mastery
                </span>
              </div>

              <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-800">
                <div
                  className="h-1.5 rounded-full bg-amber-500"
                  style={{ width: `${area.mastery}%` }}
                />
              </div>

              {area.unsolvedProblems.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  {area.unsolvedProblems.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      href={`/problems/${p.slug}`}
                      className="flex items-center justify-between rounded-md border border-zinc-800 px-3 py-2 text-sm hover:border-zinc-700 hover:bg-zinc-900/50"
                    >
                      <span className="text-zinc-300">{p.title}</span>
                      <span className={`text-xs font-medium ${difficultyColor[p.difficulty]}`}>
                        {p.difficulty}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}