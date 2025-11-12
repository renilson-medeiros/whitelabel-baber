import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ date: string }> }
) {
  const { date } = await context.params; // ✅ AQUI O AJUSTE

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ message: "Data inválida" }, { status: 400 });
  }

  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T23:59:59`);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        service: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("Erro ao buscar agendamentos", err);
    return NextResponse.json(
      { message: "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
}
