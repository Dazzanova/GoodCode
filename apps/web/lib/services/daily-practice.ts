import { prisma } from "@/lib/db/prisma";

export type PracticePick = {
	problem: { id: string; title: string; slug: string; difficulty: string };
	reason: string;
};

export async function getDailyPractice(
	userId: string,
	limit = 5,
): Promise<PracticePick[]> {
	const picks: PracticePick[] = [];
	const usedProblemIds = new Set<string>();

	const dueRevisions = await prisma.problemProgress.findMany({
		where: {
			userId,
			status: "SOLVED",
			nextReviewAt: { lte: new Date() },
		},
		orderBy: { nextReviewAt: "asc" },
		take: Math.ceil(limit * 0.5),
		select: {
			solvedAt: true,
			problem: {
				select: { id: true, title: true, slug: true, difficulty: true },
			},
		},
	});

	for (const r of dueRevisions) {
		if (usedProblemIds.has(r.problem.id)) continue;
		const daysAgo = r.solvedAt
			? Math.max(
					1,
					Math.round(
						(Date.now() - r.solvedAt.getTime()) / (1000 * 60 * 60 * 24),
					),
				)
			: null;
		picks.push({
			problem: r.problem,
			reason: daysAgo
				? `Revision — solved ${daysAgo} days ago`
				: "Revision — due for review",
		});
		usedProblemIds.add(r.problem.id);
	}

	// 2. Weak patterns: patterns where the user has attempted something but
	// mastery is low, pick an unsolved problem from within them.
	if (picks.length < limit) {
		const patterns = await prisma.pattern.findMany({
			select: {
				name: true,
				problems: {
					select: {
						problem: {
							select: {
								id: true,
								title: true,
								slug: true,
								difficulty: true,
								published: true,
							},
						},
					},
				},
			},
		});

		const solvedProblemIds = new Set(
			(
				await prisma.problemProgress.findMany({
					where: { userId, status: "SOLVED" },
					select: { problemId: true },
				})
			).map((p) => p.problemId),
		);

		const patternStats = patterns
			.map((p) => {
				const problems = p.problems
					.map((pp) => pp.problem)
					.filter((pr) => pr.published);
				const solvedCount = problems.filter((pr) =>
					solvedProblemIds.has(pr.id),
				).length;
				const attempted = problems.some((pr) => solvedProblemIds.has(pr.id));
				const mastery =
					problems.length === 0 ? 0 : (solvedCount / problems.length) * 100;
				return { name: p.name, problems, mastery, attempted };
			})
			.filter((p) => p.attempted && p.mastery < 70 && p.problems.length > 0)
			.sort((a, b) => a.mastery - b.mastery);

		for (const pattern of patternStats) {
			if (picks.length >= limit) break;
			const unsolved = pattern.problems.find(
				(pr) => !solvedProblemIds.has(pr.id) && !usedProblemIds.has(pr.id),
			);
			if (!unsolved) continue;
			picks.push({
				problem: unsolved,
				reason: `Weak pattern — your accuracy in ${pattern.name} is low`,
			});
			usedProblemIds.add(unsolved.id);
		}
	}

	// 3. New: never attempted at all.
	if (picks.length < limit) {
		const attemptedIds = await prisma.problemProgress.findMany({
			where: { userId },
			select: { problemId: true },
		});
		const excludeIds = [
			...usedProblemIds,
			...attemptedIds.map((p) => p.problemId),
		];

		const newProblems = await prisma.problem.findMany({
			where: { published: true, id: { notIn: excludeIds } },
			orderBy: { createdAt: "asc" },
			take: limit - picks.length,
			select: { id: true, title: true, slug: true, difficulty: true },
		});

		for (const p of newProblems) {
			picks.push({ problem: p, reason: "New — build your pattern library" });
		}
	}

	return picks;
}
