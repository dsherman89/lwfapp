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
      email: "admin@lwf.test",
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
      email: "user@lwf.test",
      password: passwordHash,
      role: Role.USER,
      alignment: Alignment.HEEL,
      isChampion: false,
    },
  });

  console.log("Seeded users: admin / password123, user / password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
