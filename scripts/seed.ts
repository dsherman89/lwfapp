import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@lwf.test" },
    update: {},
    create: { email: "admin@lwf.test", password: passwordHash, role: Role.ADMIN, name: "Admin" },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@lwf.test" },
    update: {},
    create: { email: "user@lwf.test", password: passwordHash, role: Role.USER, name: "User" },
  });

  const match = await prisma.match.create({
    data: {
      title: "Sample Match",
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "TBD",
    },
  });

  await prisma.matchAssignment.create({
    data: { matchId: match.id, userId: user.id },
  });

  console.log("Seeded:", { admin: admin.email, user: user.email, match: match.title });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
