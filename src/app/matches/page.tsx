import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import LogoutButton from "@/components/LogoutButton";

const prisma = new PrismaClient();

export default async function MatchesPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string;

  const assignments = await prisma.matchAssignment.findMany({
    where: { userId },
    include: { match: true },
    orderBy: { match: { eventDate: "asc" } },
  });

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My matches</h1>
        <LogoutButton />
      </div>

      {assignments.length === 0 ? (
        <p>No matches assigned yet.</p>
      ) : (
        <ul className="space-y-2">
          {assignments.map((a) => (
            <li key={a.id} className="rounded-lg border p-4">
              <div className="font-medium">{a.match.title}</div>
              <div className="text-sm opacity-70">
                {new Date(a.match.eventDate).toLocaleString()} {a.match.location ? `• ${a.match.location}` : ""}
              </div>
            </li>
          ))}
        </ul>
      )}

      {(session?.user as any)?.role === "ADMIN" ? (
        <a className="underline" href="/admin/events">Go to admin</a>
      ) : null}
    </main>
  );
}
