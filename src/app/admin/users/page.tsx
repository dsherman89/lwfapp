import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient, Alignment, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import AdminUsersClient from "./users-client";

const prisma = new PrismaClient();
const PAGE_SIZE = 20;

function parseYesNo(v: string | undefined) {
  if (v === "yes") return true;
  if (v === "no") return false;
  return undefined;
}

export async function createUser(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const adminId = (session?.user as any)?.id as string;

  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const alignment = String(formData.get("alignment") || "");
  const isChampion = String(formData.get("isChampion") || "") === "on";
  const role = String(formData.get("role") || "USER");

  if (!username || !password) return;
  if (alignment !== "HEEL" && alignment !== "FACE") return;
  if (role !== "ADMIN" && role !== "USER") return;

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      password: hash,
      alignment: alignment as Alignment,
      isChampion,
      role: role as Role,
      createdByUserId: adminId,
    },
  });
}

export async function updateUser(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const adminId = (session?.user as any)?.id as string;

  const id = String(formData.get("id") || "");
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const alignment = String(formData.get("alignment") || "");
  const isChampion = String(formData.get("isChampion") || "") === "on";
  const role = String(formData.get("role") || "USER");

  if (!id || !username) return;
  if (alignment !== "HEEL" && alignment !== "FACE") return;
  if (role !== "ADMIN" && role !== "USER") return;

  // Safety: cannot remove your own admin role
  if (id === adminId && role !== "ADMIN") return;

  const data: any = {
    username,
    alignment: alignment as Alignment,
    isChampion,
    role: role as Role,
  };

  // Only change password if explicitly set
  if (password.trim().length > 0) {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({ where: { id }, data });
}

export async function deleteUser(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const adminId = (session?.user as any)?.id as string;

  const id = String(formData.get("id") || "");
  if (!id) return;

  // Safety: cannot delete yourself
  if (id === adminId) return;

  await prisma.user.delete({ where: { id } });
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const q = String(sp.q || "").trim();
  const page = Math.max(1, Number(sp.page || 1));
  const alignment = String(sp.alignment || "");
  const champion = parseYesNo(String(sp.champion || ""));
  const admin = parseYesNo(String(sp.admin || ""));

  const where: any = {};
  if (q) where.username = { contains: q };
  if (alignment === "HEEL" || alignment === "FACE") where.alignment = alignment;
  if (typeof champion === "boolean") where.isChampion = champion;
  if (typeof admin === "boolean") where.role = admin ? "ADMIN" : "USER";

  const total = await prisma.user.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const users = await prisma.user.findMany({
    where,
    orderBy: { username: "asc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      username: true,
      alignment: true,
      isChampion: true,
      role: true,
      createdAt: true,
      createdByUserId: true,
    },
  });

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id as string;

  return (
    <AdminUsersClient
      users={users}
      q={q}
      page={page}
      total={total}
      totalPages={totalPages}
      alignment={alignment}
      champion={String(sp.champion || "")}
      admin={String(sp.admin || "")}
      currentUserId={currentUserId}
      createUser={createUser}
      updateUser={updateUser}
      deleteUser={deleteUser}
    />
  );
}
