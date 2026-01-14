"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border p-6 space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>

        <input className="w-full rounded-md border p-2" placeholder="email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input className="w-full rounded-md border p-2" placeholder="password" type="password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="w-full rounded-md border p-2"
          onClick={() => signIn("credentials", { email, password, callbackUrl: "/post-login" })}>
          Sign in
        </button>
      </div>
    </main>
  );
}
