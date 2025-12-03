"use client";

import Image from "next/image";
import { BarbershopService, Barbershop } from "@/generated/prisma/client";
import { isHoliday } from "@/lib/holidays";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ptBR } from "date-fns/locale";
import { useAction } from "next-safe-action/hooks";
import { createBooking } from "../_actions/create-booking";
import { useQuery } from "@tanstack/react-query";
import { getDateAvailableTimeSlots } from "../_actions/get-date-available-time-slots";
import ClientInfoModal from "./client-info-modal";
import { toast } from "sonner";
import { startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { PageSectionScroller } from "./ui/page";

interface ServiceItemProps {
  service: BarbershopService & {
    barbershop: Barbershop;
  }
  logged?: boolean;
  userName?: string;
}

export function ServiceItem({ service, logged, userName }: ServiceItemProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const { executeAsync, isPending } = useAction(createBooking);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const router = useRouter();

  const { data: availableTimeSlots } = useQuery({
    queryKey: ["date-available-time-slots", service.barbershopId, selectedDate],
    queryFn: () =>
      getDateAvailableTimeSlots({
        barbershopId: service.barbershopId,
        date: selectedDate!,
      }),
    enabled: Boolean(selectedDate),
  });

  // Filtra horários se for o dia de hoje
  const filteredTimeSlots = (() => {
    if (!availableTimeSlots?.data || !selectedDate) return [];

    const now = new Date();
    const isToday = 
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear();

    if (!isToday) {
      return availableTimeSlots.data;
    }

    // Filtra apenas horários futuros para hoje
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return availableTimeSlots.data.filter((time) => {
      const [hour, minute] = time.split(':').map(Number);
      return hour > currentHour || (hour === currentHour && minute > currentMinute);
    });
  })();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined); // Limpa horário selecionado ao mudar data
  };

  const priceInReais = (service.priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const priceInReaisInteger = Math.floor(service.priceInCents / 100);

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })
    : "";

  const isConfirmDisabled = !selectedDate || !selectedTime;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasHolidays = (() => {
    if (!selectedDate) return false;
    
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const daysInMonth = eachDayOfInterval({ start, end });
    
    return daysInMonth.some(day => isHoliday(day));
  })();

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <div className="w-full border-border bg-card flex items-center justify-center gap-3 rounded-2xl border border-solid p-3 cursor-pointer">
        <div className="relative size-[110px] shrink-0 overflow-hidden rounded-[10px]">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex grow basis-0 flex-row items-center self-stretch">
          <div className="relative flex h-full min-height-0 min-w-0 grow basis-0 flex-col items-start justify-between">
            <div className="flex h-[67.5px] w-full flex-col items-start gap-1 text-sm leading-[1.4]">
              <p className="text-card-foreground w-full font-bold">
                {service.name}
              </p>
              <p className="text-muted-foreground w-full font-normal">
                {service.description}
              </p>
            </div>

            <div className="flex w-full items-center justify-between">
              <p className="text-card-foreground text-sm leading-[1.4] font-bold whitespace-pre">
                {priceInReais}
              </p>

              {/* <SheetTrigger asChild>
                <Button className="rounded-full px-4 py-2 cursor-pointer" variant="default">
                  Reservar agora
                </Button>
              </SheetTrigger> */}

              <Button
                className="rounded-full px-4 py-2 cursor-pointer"
                variant="default"
                onClick={() => {
                  if (!logged) {
                    toast.error("Você precisa estar logado para fazer uma reserva.");

                    document.getElementById("menu-button")?.click();

                    return
                  }
                  setSheetIsOpen(true);
                }}
              >
                Reservar agora
              </Button>

            </div>
          </div>
        </div>
      </div>

      <SheetContent className="w-[370px] overflow-y-auto p-0">
        <div className="flex h-full flex-col gap-6">
          <SheetHeader className="px-5 pt-6">
            <SheetTitle className="text-lg font-bold">Fazer Reserva</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-5">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                if (date < today) return true;
                if (date.getDay() === 0) return true;
                if (isHoliday(date)) return true;
                return false;
              }}
              modifiers={{
                holiday: (date) => isHoliday(date) && date >= today,
              }}
              modifiersClassNames={{
                holiday: "text-red-600 opacity-100",
              }}
              className="w-full p-0"
              locale={ptBR}
            />
            
            {hasHolidays && (
              <p className="text-xs text-muted-foreground text-left">
                <span className="text-red-500">Não atendemos em feriados</span>
              </p>
            )}
          </div>

          {selectedDate && (
            <>
              <Separator />

              <div className="px-5 py-2">
                {filteredTimeSlots.length > 0 ? (
                  <PageSectionScroller>
                  <div className="max-h-[100px] overflow-y-auto space-y-2 pr-2 [&::-webkit-scrollbar]:hidden">
                    {filteredTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          w-full py-2 px-4 rounded-full border text-center transition-all cursor-pointer
                          ${selectedTime === time 
                            ? 'border-primary bg-foreground text-primary-foreground font-medium' 
                            : 'border-border bg-card hover:bg-foreground/10'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  </PageSectionScroller>
                ) : (
                  <p className="text-muted-foreground text-center text-sm py-8">
                    Todos os horários já foram reservados.
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex flex-1 flex-col gap-3 px-5">
                <div className="border-border bg-card flex w-full flex-col gap-3 rounded-[10px] border border-solid p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-card-foreground text-base font-bold">
                      {service.name}
                    </p>
                    <p className="text-card-foreground text-sm font-bold">
                      R${priceInReaisInteger},00
                    </p>
                  </div>

                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <p>Data</p>
                    <p>{formattedDate}</p>
                  </div>

                  {selectedTime && (
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                      <p>Horário</p>
                      <p>{selectedTime}</p>
                    </div>
                  )}

                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <p>Barbearia</p>
                    <p>{service.barbershop.name}</p>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-6">
                <Button
                  className="w-full rounded-full cursor-pointer"
                  disabled={isConfirmDisabled || isPending}
                  onClick={() => setClientModalOpen(true)}
                >
                  Confirmar
                </Button>
              </div>
            </>
          )}
        </div>
        <ClientInfoModal
          open={clientModalOpen}
          onClose={() => setClientModalOpen(false)}

          defaultName={userName ?? ""} // Preencher com o nome do user logado

          onConfirm={async (name, phone) => {
            const [hours, minutes] = selectedTime!.split(":");
            const date = new Date(selectedDate!);
            date.setHours(Number(hours), Number(minutes));

            const result = await executeAsync({
              serviceId: service.id,
              date,
              clientName: name,
              clientPhone: phone,
            });

            if (!result?.serverError && !result?.validationErrors) {
              toast.success(`Agendamento para ${service.name} realizado!`);
              
              setClientModalOpen(false);
              setSheetIsOpen(false);
              
              router.push("/bookings");
            } else {
              toast.error("Erro ao criar agendamento");
            }
          }}
        />

      </SheetContent>
    </Sheet>
  );
}