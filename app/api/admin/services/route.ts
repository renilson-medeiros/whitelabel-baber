import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.barbershopService.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  const body = await req.json();

  const barbershop = await prisma.barbershop.findFirst();

  if (!barbershop) {
    return NextResponse.json(
      { message: "Nenhuma barbearia encontrada no banco" },
      { status: 400 }
    );
  }

  const service = await prisma.barbershopService.create({
    data: {
      name: body.name,
      priceInCents: body.priceInCents,
      description: body.description ?? "",
      imageUrl: body.imageUrl ?? "",
      barbershopId: barbershop.id,
    },
  });

  return NextResponse.json({ service });
}
