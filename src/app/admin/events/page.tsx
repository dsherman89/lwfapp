import { PrismaClient } from "@prisma/client";
import NavBar from "@/components/NavBar";

const prisma = new PrismaClient();

async function createMatch(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("eventDate") || "").trim();
  const location = String(formData.get("location") || "").trim();
  if (!title || !date) return;

  await prisma.match.create({
    data: { title, eventDate: new Date(date), location: location || null },
  });
}

async function assign(formData: FormData) {
  "use server";
  const matchId = String(formData.get("matchId") || "");
  const userId = String(formData.get("userId") || "");
  if (!matchId || !userId) return;

  await prisma.matchAssignment.upsert({
    where: { matchId_userId: { matchId, userId } },
    update: {},
    create: { matchId, userId },
  });
}

export default async function AdminMatchesPage() {
  const users = await prisma.user.findMany({ orderBy: { email: "asc" } });
  const matches = await prisma.match.findMany({
    include: { participants: { include: { user: true } } },
    orderBy: { eventDate: "asc" },
  });

  return (
    <>
      <NavBar />

      <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin: Events</h1>

      <section className="rounded-lg border p-4 space-y-3">
        <h2 className="font-medium">Create event</h2>
        <form action={createMatch} className="grid gap-2 max-w-md">
          <input className="rounded-md border p-2" name="title" placeholder="Match title" />
          <input className="rounded-md border p-2" name="eventDate" type="datetime-local" />
          <input className="rounded-md border p-2" name="location" placeholder="Location (optional)" />
          <button className="rounded-md border p-2">Create</button>
        </form>
      </section>

      <section className="rounded-lg border p-4 space-y-3">
        <h2 className="font-medium">Assign user to event</h2>
        <form action={assign} className="flex flex-wrap gap-2 items-center">
          <select className="rounded-md border p-2" name="matchId" defaultValue="">
            <option value="" disabled>Select match</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          <select className="rounded-md border p-2" name="userId" defaultValue="">
            <option value="" disabled>Select user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.email}</option>
            ))}
          </select>

          <button className="rounded-md border p-2">Assign</button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Current events</h2>
        <ul className="space-y-2">
          {matches.map((m) => (
            <li key={m.id} className="rounded-lg border p-4">
              <div className="font-medium">{m.title}</div>
              <div className="text-sm opacity-70">
                {new Date(m.eventDate).toLocaleString()} {m.location ? `• ${m.location}` : ""}
              </div>
              <div className="mt-2 text-sm">
                <div className="opacity-70">Participants:</div>
                {m.participants.length === 0 ? <div>None</div> : (
                  <ul className="list-disc pl-5">
                    {m.participants.map((p) => <li key={p.id}>{p.user.email}</li>)}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <a className="underline" href="/matches">Back to My matches</a>
    </main>
    </>
  );
}
