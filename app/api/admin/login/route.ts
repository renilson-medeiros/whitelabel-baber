import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ message: "Admin não encontrado" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ message: "Senha incorreta" }, { status: 401 });
    }

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    const response = NextResponse.json({ message: "Login realizado com sucesso" });
    response.cookies.set({
      name: "adminToken",
      value: token,
      httpOnly: true, 
      path: "/",      
      maxAge: 2 * 60 * 60, 
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
