// components/layout/nav.tsx
import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function Nav() {
  const session = await auth();

  return (
    <nav className="border-b border-zinc-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-zinc-100">
            GoodCode
          </Link>
          <Link href="/problems" className="text-sm text-zinc-400 hover:text-zinc-200">
            Problems
          </Link>
          <Link href="/patterns" className="text-sm text-zinc-400 hover:text-zinc-200">
            Patterns
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin/problems" className="text-sm text-zinc-400 hover:text-zinc-200">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="text-sm text-zinc-500">{session.user.email}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="text-sm text-zinc-400 hover:text-zinc-200">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-200">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}