"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 gap-8">
      {/* Logo */}
      <div className="w-1/4 max-w-[220px] min-w-[140px] flex justify-center">
        <Image
          src="/lwf-logo.jpg"
          alt="LWF Wrestling"
          width={440}
          height={220}
          priority
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Sign in box */}
      <div className="panel w-full max-w-[420px] px-10 py-8">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-sm muted">Admin and roster access</p>
        </div>

        <div className="mt-6 space-y-4">
          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-accent w-full"
            onClick={() =>
              signIn("credentials", {
                email: username,
                password,
                callbackUrl: "/post-login",
              })
            }
          >
            Sign in
          </button>
        </div>
      </div>
    </main>
  );
}
