"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

type Option = { name: string; slug: string };

export function ProblemFilters({
  topics,
  patterns,
}: {
  topics: Option[];
  patterns: Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page"); // reset pagination whenever filters change

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <input
        type="text"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => updateParam("search", e.target.value)}
        placeholder="Search problems..."
        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200"
      />

      <select
        defaultValue={searchParams.get("topicSlug") ?? ""}
        onChange={(e) => updateParam("topicSlug", e.target.value)}
        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-300"
      >
        <option value="">All Topics</option>
        {topics.map((t) => (
          <option key={t.slug} value={t.slug}>{t.name}</option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("patternSlug") ?? ""}
        onChange={(e) => updateParam("patternSlug", e.target.value)}
        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-300"
      >
        <option value="">All Patterns</option>
        {patterns.map((p) => (
          <option key={p.slug} value={p.slug}>{p.name}</option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("difficulty") ?? ""}
        onChange={(e) => updateParam("difficulty", e.target.value)}
        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-300"
      >
        <option value="">All Difficulties</option>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>

      {isPending && <span className="self-center text-sm text-zinc-600">Loading...</span>}
    </div>
  );
}