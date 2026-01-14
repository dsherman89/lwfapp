import Link from "next/link";

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="rounded-xl border p-5 hover:bg-black/5 transition">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-sm opacity-70">{desc}</div>
    </Link>
  );
}

export default function AdminHome() {
  return (
    <>
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl">
          <Card
            title="User administration"
            desc="Create, edit, or delete users"
            href="/admin/users"
          />
          <Card
            title="Events"
            desc="Create, edit, or delete events"
            href="/admin/events"
          />
          <Card
            title="Matches"
            desc="Create, edit, or delete matches"
            href="/admin/matches"
          />
          <div className="rounded-xl border p-5 opacity-60">
            <div className="text-lg font-semibold">Coming soon</div>
            <div className="mt-1 text-sm">More admin tools will appear here.</div>
          </div>
        </div>
      </main>
    </>
  );
}
