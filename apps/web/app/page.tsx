// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold text-zinc-100">
        Practice with intent.
      </h1>
      <p className="mt-3 max-w-md text-zinc-500">
        GoodCode helps you recognize patterns, think before looking at
        solutions, and actually retain what you solve.
      </p>
      <Link
        href="/problems"
        className="mt-8 rounded-md bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white"
      >
        Browse Problems
      </Link>
    </main>
  );
}