import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    throw new Error("Defina ADMIN_USERNAME e ADMIN_PASSWORD no .env");
  }

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await prisma.admin.upsert({
    where: { username: process.env.ADMIN_USERNAME },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME,
      password: passwordHash,
      name: "Administrador",
      email: process.env.ADMIN_EMAIL || null,
    },
  });

  console.log("Admin criado!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
