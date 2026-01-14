import Link from "next/link";

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="card block no-underline">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-sm muted">{desc}</div>
    </Link>
  );
}

export default function AdminHome() {
  return (
    <main className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-4">
        <h1 className="text-2xl font-semibold text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card title="User administration" desc="Create, edit, or delete users" href="/admin/users" />
          <Card title="Events" desc="Create, edit, or delete events" href="/admin/events" />
          <Card title="Matches" desc="Create, edit, or delete matches" href="/admin/matches" />
          <div className="card opacity-70">
            <div className="text-lg font-semibold">Coming soon</div>
            <div className="mt-1 text-sm muted">More admin tools will appear here.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
