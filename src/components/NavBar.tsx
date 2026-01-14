"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/LogoutButton";

export default function NavBar() {
  const { data } = useSession();
  const role = (data?.user as any)?.role;

  return (
    <header className="border-b">
      <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between">
        <nav className="flex gap-4 text-sm">
          <Link className="underline" href="/matches">My Matches</Link>
          {role === "ADMIN" ? <Link className="underline" href="/admin/events">Admin: Events</Link> : null}
        </nav>
        <LogoutButton />
      </div>
    </header>
  );
}
