"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) setError("Invalid credentials");
    else window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-32 flex max-w-sm flex-col gap-4 px-6">
      <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        className="rounded-md border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        className="rounded-md border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit">Sign in</Button>
    </form>
  );
}