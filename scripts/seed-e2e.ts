import { PrismaClient, Role, Alignment } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: passwordHash,
      role: Role.ADMIN,
      alignment: Alignment.FACE,
      isChampion: false,
    },
  });

  await prisma.user.upsert({
    where: { username: "user" },
    update: {},
    create: {
      username: "user",
      password: passwordHash,
      role: Role.USER,
      alignment: Alignment.HEEL,
      isChampion: false,
    },
  });

  // A sample wrestler to search for
  await prisma.user.upsert({
    where: { username: "Zak Wayne" },
    update: {},
    create: {
      username: "Zak Wayne",
      password: passwordHash,
      role: Role.USER,
      alignment: Alignment.FACE,
      isChampion: false,
      createdByUserId: (await prisma.user.findUnique({ where: { username: "admin" } }))!.id,
    },
  });

  console.log("E2E seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
