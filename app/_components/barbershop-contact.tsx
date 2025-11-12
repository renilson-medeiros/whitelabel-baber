"use client";

import { PhoneItem } from "./phone-item";
import { Separator } from "./ui/separator";

interface BarbershopContactProps {
  phones: string[];
}

export function BarbershopContact({ phones }: BarbershopContactProps) {
  return (
    <>
      {/* Divider */}
      <div className="px-0 py-6">
        <Separator />
      </div>

      {/* Contato */}
      <div className="flex w-full flex-col items-start gap-3 px-5 py-0">
        <div className="flex items-center justify-center gap-2.5">
          <p className="text-foreground text-xs font-bold uppercase">
            CONTATO
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          {phones.map((phone, index) => (
            <PhoneItem key={index} phone={phone} />
          ))}
        </div>
      </div>
    </>
  );
}
