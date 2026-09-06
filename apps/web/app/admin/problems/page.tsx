import Link from "next/link";
import { getAllProblemsForAdmin } from "@/lib/services/admin-problems";

export default async function AdminProblemsPage() {
  const problems = await getAllProblemsForAdmin();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-100">Manage Problems</h1>
        <Link href="/admin/problems/new" className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900">
          + New Problem
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p.id} className="border-b border-zinc-800/50 last:border-0">
                <td className="px-4 py-3 text-zinc-200">{p.title}</td>
                <td className="px-4 py-3 text-zinc-500">{p.topic.name}</td>
                <td className="px-4 py-3 text-zinc-500">{p.difficulty}</td>
                <td className="px-4 py-3">
                  <span className={p.published ? "text-emerald-500" : "text-zinc-600"}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/problems/${p.id}/edit`} className="text-zinc-400 hover:text-zinc-200">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}