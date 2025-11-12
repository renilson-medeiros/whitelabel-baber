"use client";

import { ServiceItem } from "./service-item";
import { Separator } from "./ui/separator";
import type { Prisma } from "@prisma/client";

interface BarbershopServicesProps {
  barbershop: Prisma.BarbershopGetPayload<{ include: { services: true } }>;
}

export function BarbershopServices({ barbershop }: BarbershopServicesProps) {
  return (
    <>
      <div className="px-0 py-6">
        <Separator />
      </div>

      <div className="flex w-full flex-col items-start gap-3 px-5 py-0">
        <div className="flex items-center justify-center gap-2.5">
          <p className="text-foreground text-xs font-bold uppercase">
            SERVIÇOS
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          {barbershop.services.map((service) => (
            <ServiceItem key={service.id} service={service} />
          ))}
        </div>
      </div>
    </>
  );
}
