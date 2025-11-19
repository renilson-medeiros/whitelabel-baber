import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Dados da barbearia
    const barbershop = await prisma.barbershop.create({
      data: {
        name: "Barbearia Estilo Moderno",
        address: "Av. Pres. Kennedy, 456 - Industrial, Contagem - MG, 32015-789",
        imageUrl: "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png",
        phones: ["(41) 99999-8888"],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac augue ullamcorper, pharetra orci mollis, auctor tellus. Phasellus pharetra erat ac libero efficitur tempus. Donec pretium convallis iaculis. Etiam eu felis sollicitudin, cursus mi vitae, iaculis magna. Nam non erat neque. In hac habitasse platea dictumst. Pellentesque molestie accumsan tellus id laoreet.",
      },
    });

    // Serviços da barbearia
    const services = [
      {
        name: "Corte",
        description: "Estilo personalizado com as últimas tendências.",
        price: 60.0,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 40.0,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 35.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 20.0,
        imageUrl:
          "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      },
      {
        name: "Massagem",
        description: "Relaxe com uma massagem revigorante.",
        price: 50.0,
        imageUrl:
          "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Hidratação",
        description: "Hidratação profunda para cabelo e barba.",
        price: 25.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
    ];

    // Criar os serviços vinculados à barbearia
    for (const service of services) {
      await prisma.barbershopService.create({
        data: {
          name: service.name,
          description: service.description,
          priceInCents: service.price * 100,
          imageUrl: service.imageUrl,
          barbershop: { connect: { id: barbershop.id } },
        },
      });
    }

    console.log("Barbearia e serviços criados com sucesso!");

    await prisma.$disconnect();
  } catch (error) {
    console.error("Erro ao criar a barbearia:", error);
  }
}

seedDatabase();
