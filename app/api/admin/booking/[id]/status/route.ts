import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PatchBody {
  action: "finish" | "cancel";
}

// Força o TS a não reclamar na Vercel
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PATCH: any = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const body = (await req.json()) as PatchBody;

  if (!["finish", "cancel"].includes(body.action)) {
    return NextResponse.json({ message: "Ação inválida" }, { status: 400 });
  }

  try {
    const updated = await prisma.booking.update({
      where: { id },
      data:
        body.action === "finish"
          ? { finished: true, finishedAt: new Date() }
          : { cancelled: true, cancelledAt: new Date() },
    });

    return NextResponse.json({ booking: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erro ao atualizar booking" }, { status: 500 });
  }
};
