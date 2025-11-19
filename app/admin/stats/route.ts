import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "day";

    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    // Define o período
    switch (period) {
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 }); // Segunda-feira
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "day":
      default:
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
    }

    // Busca todos os agendamentos do período
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: true,
      },
    });

    // Calcula as estatísticas
    const scheduled = bookings.length; // Total de agendamentos
    const completed = bookings.filter((b) => b.finished).length;
    const cancelled = bookings.filter((b) => b.cancelled).length;

    // Agrupa serviços finalizados por nome
    const servicesMap = new Map<string, { count: number; total: number }>();

    bookings
      .filter((b) => b.finished) // Apenas finalizados
      .forEach((booking) => {
        const serviceName = booking.service.name;
        const servicePrice = booking.service.priceInCents;

        if (servicesMap.has(serviceName)) {
          const current = servicesMap.get(serviceName)!;
          servicesMap.set(serviceName, {
            count: current.count + 1,
            total: current.total + servicePrice,
          });
        } else {
          servicesMap.set(serviceName, {
            count: 1,
            total: servicePrice,
          });
        }
      });

    // Converte para array e ordena por quantidade
    const services = Array.from(servicesMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        total: data.total,
      }))
      .sort((a, b) => b.count - a.count); // Mais realizados primeiro

    return NextResponse.json({
      scheduled,
      completed,
      cancelled,
      services,
    });
  } catch (error) {
    console.error("Erro ao buscar stats:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}