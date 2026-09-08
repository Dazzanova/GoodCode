import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { getDailyPractice } from "@/lib/services/daily-practice";

const difficultyColor: Record<string, string> = {
	EASY: "text-emerald-500",
	MEDIUM: "text-amber-500",
	HARD: "text-rose-500",
};

export default async function DashboardPage() {
	const session = await auth();
	if (!session?.user?.id) redirect("/login");

	const [picks, solvedCount, dueCount] = await Promise.all([
		getDailyPractice(session.user.id, 5),
		prisma.problemProgress.count({
			where: { userId: session.user.id, status: "SOLVED" },
		}),
		prisma.problemProgress.count({
			where: {
				userId: session.user.id,
				status: "SOLVED",
				nextReviewAt: { lte: new Date() },
			},
		}),
	]);

	return (
		<div className="mx-auto max-w-3xl px-6 py-12">
			<h1 className="text-2xl font-semibold text-zinc-100">
				Welcome back{session.user.name ? `, ${session.user.name}` : ""}
			</h1>

			<div className="mt-6 flex gap-6 text-sm">
				<div>
					<p className="text-zinc-500">Solved</p>
					<p className="mt-1 text-xl font-semibold text-zinc-100">
						{solvedCount}
					</p>
				</div>
				<div>
					<p className="text-zinc-500">Needs Review</p>
					<p className="mt-1 text-xl font-semibold text-zinc-100">{dueCount}</p>
				</div>
			</div>

			<div className="mt-10">
				<h2 className="text-sm font-medium text-zinc-400">
					Today&apos;s Practice
				</h2>

				{picks.length === 0 ? (
					<p className="mt-3 text-sm text-zinc-600">
						No picks available — try browsing problems directly.
					</p>
				) : (
					<div className="mt-3 space-y-2">
						{picks.map((pick) => (
							<Link
								key={pick.problem.id}
								href={`/problems/${pick.problem.slug}`}
								className="block rounded-lg border border-zinc-800 p-4 hover:border-zinc-700 hover:bg-zinc-900/50"
							>
								<div className="flex items-center justify-between">
									<span className="font-medium text-zinc-200">
										{pick.problem.title}
									</span>
									<span
										className={`text-xs font-medium ${difficultyColor[pick.problem.difficulty]}`}
									>
										{pick.problem.difficulty}
									</span>
								</div>
								<p className="mt-1 text-sm text-zinc-500">{pick.reason}</p>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
