// app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-32">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" className="border p-2 rounded" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="border p-2 rounded" />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-black text-white p-2 rounded">Sign in</button>
    </form>
  );
}