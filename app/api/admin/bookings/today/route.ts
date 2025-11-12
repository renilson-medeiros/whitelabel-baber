import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: {
      date: { gte: today, lt: tomorrow },
    },
    include: { user: true, service: true, barbershop: true },
  });

  return NextResponse.json({ bookings });
}
