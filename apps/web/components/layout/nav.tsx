import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function Nav() {
  const session = await auth();

  return (
    <nav className="border-b border-border">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-foreground">
            GoodCode
          </Link>
          <Link href="/problems" className="text-sm text-muted hover:text-foreground">
            Problems
          </Link>
          <Link href="/patterns" className="text-sm text-muted hover:text-foreground">
            Patterns
          </Link>
          {session?.user && (
            <>
              <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/revision" className="text-sm text-muted hover:text-foreground">
                Revision
              </Link>
              <Link href="/weak-areas" className="text-sm text-muted hover:text-foreground">
                Weak Areas
              </Link>
            </>
          )}
          {session?.user?.role === "ADMIN" && (
            <>
              <Link href="/admin/problems" className="text-sm text-muted hover:text-foreground">
                Admin
              </Link>
              <Link href="/admin/taxonomy" className="text-sm text-muted hover:text-foreground">
                Taxonomy
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="text-sm text-muted">{session.user.email}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="ghost" className="px-0 py-0">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}