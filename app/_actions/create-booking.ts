"use server";
import { actionClient } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { returnValidationErrors } from "next-safe-action";
import { headers } from "next/headers";
import { z } from "zod";

const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
  clientName: z.string().min(2, "Nome obrigatório"),
  clientPhone: z.string().min(8, "Telefone inválido"),
});

export const createBooking = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { serviceId, date, clientName, clientPhone } }) => {

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const service = await prisma.barbershopService.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      returnValidationErrors(inputSchema, {
        _errors: ["Service not found"],
      });
    }

    // verificar se já existe agendamento para essa data
    const existingBooking = await prisma.booking.findFirst({
      where: {
        barbershopId: service.barbershopId,
        date,
      },
    });

    if (existingBooking) {
      returnValidationErrors(inputSchema, {
        _errors: ["Já existe um agendamento para essa data."],
      });
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId,
        date,
        userId: session.user.id,
        barbershopId: service.barbershopId,
        clientName,
        clientPhone,
      },
    });

    return booking;
  });
