"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const inputSchema = z.object({
  bookingId: z.string().uuid(),
  action: z.enum(["finish", "cancel"]),
});

export async function updateBookingStatus({ bookingId, action }: z.infer<typeof inputSchema>) {
  inputSchema.parse({ bookingId, action });

  // Aqui você poderia verificar autorização do admin via cookie JWT, se tiver
  // Exemplo: const token = cookies().get("adminToken"); decode/jwt.verify...

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking) throw new Error("Reserva não encontrada");

  if (action === "finish" && booking.finished) throw new Error("Reserva já finalizada");
  if (action === "cancel" && booking.cancelled) throw new Error("Reserva já cancelada");

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      finished: action === "finish",
      cancelled: action === "cancel",
      finishedAt: action === "finish" ? new Date() : booking.finishedAt,
      cancelledAt: action === "cancel" ? new Date() : booking.cancelledAt,
    },
  });

  return updatedBooking;
}
