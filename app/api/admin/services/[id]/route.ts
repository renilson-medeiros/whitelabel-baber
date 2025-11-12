import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; 
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const updatedService = await prisma.barbershopService.update({
      where: { id },
      data: {
        name: body.name,
        priceInCents: Number(body.priceInCents),
        description: body.description ?? "",
        imageUrl: body.imageUrl ?? "",
      },
    });

    return NextResponse.json({ service: updatedService });
  } catch (error) {
    
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; 

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    await prisma.barbershopService.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {

    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
