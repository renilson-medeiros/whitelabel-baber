"use client";

import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useState } from "react";
import { PhoneItem } from "./phone-item";
import Image from "next/image";
import { Button } from "./ui/button";
import { useAction } from "next-safe-action/hooks";
import { cancelBooking } from "../_actions/cancel-booking";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Booking } from "@/generated/prisma/client";

interface BookingItemProps {
  booking: {
    id: string;
    date: Date;
    cancelled: boolean | null;
    finished: boolean | null;
    clientName: string | null;
    service: {
      name: string;
      priceInCents: number;
    };
    barbershop: {
      id: string;
      name: string;
      imageUrl: string;
      address: string;
      phones: string[];
    };
  };
}

// Retorna o status correto considerando cancelled e finished
const getStatus = (booking: Pick<Booking, "date" | "cancelled" | "finished">) => {
  if (booking.cancelled) return "cancelled";
  if (booking.finished) return "finished";
  const date = new Date(booking.date);
  const now = new Date();
  return date >= now ? "confirmed" : "finished";
};

const BookingItem = ({ booking }: BookingItemProps) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  const { executeAsync: executeCancelBooking, isPending } = useAction(cancelBooking);

  const handleCancelBooking = async () => {
    
    const result = await executeCancelBooking({ bookingId: booking.id });
    
    if (result?.data) {
      toast.success("Reserva cancelada com sucesso!");
      setSheetIsOpen(false);
    } else if (result?.serverError || result?.validationErrors) {
      toast.error("Erro ao cancelar reserva. Tente novamente.");
    }
  };

  const status = getStatus(booking);
  const isConfirmed = status === "confirmed";

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <SheetTrigger asChild>
        <Card className="flex h-full w-full min-w-full cursor-pointer flex-row items-center justify-between p-0">
          <div className="flex flex-1 flex-col gap-4 px-4">
            <div className="flex flex-col gap-3 py-4">
              <Badge
                className={
                  status === "confirmed"
                    ? "bg-primary/10 text-primary uppercase"
                    : status === "finished"
                      ? "bg-blue-100 text-blue-600 uppercase"
                      : "bg-red-50 text-destructive uppercase"
                }
              >
                {status === "confirmed"
                  ? "Confirmado"
                  : status === "finished"
                    ? "Finalizado"
                    : "Cancelado"}
              </Badge>

              <div className="flex flex-col gap-2 ">
                <p className="font-bold">{booking.service.name}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>
                  <p className="text-sm text-ellipsis truncate max-w-40">{booking.barbershop.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-full w-[110px] flex-col items-center justify-center border-l border-border py-7">
            <p className="text-xs capitalize">
              {booking.date.toLocaleDateString("pt-BR", { month: "long" })}
            </p>
            <p className="text-2xl">
              {booking.date.toLocaleDateString("pt-BR", { day: "2-digit" })}
            </p>
            <p className="text-xs">
              {booking.date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </Card>
      </SheetTrigger>

      <SheetContent className="w-[370px] overflow-y-auto p-0">
        <SheetHeader className="px-5 pt-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold">Informações da Reserva</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-6 flex-1 px-5 py-6">
          <div className="relative h-[180px] w-full overflow-hidden rounded-lg">
            <Image
              src="/map.png"
              alt="Localização da barbearia"
              fill
              className="object-cover"
            />
            <div className="bg-background absolute right-5 bottom-5 left-5 rounded-lg p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold ">{booking.barbershop.name}</p>
                  <p className="text-muted-foreground truncate text-xs text-ellipsis max-w-46">
                    {booking.barbershop.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Badge
            className={
              status === "confirmed"
                ? "bg-primary/10 text-primary uppercase"
                : status === "finished"
                  ? "bg-blue-100 text-blue-600 uppercase"
                  : "bg-red-50 text-destructive uppercase"
            }
          >
            {status === "confirmed"
              ? "Agendamento Confirmado"
              : status === "finished"
                ? "Finalizado"
                : "Cancelado"}
          </Badge>

          <div className="bg-card space-y-3 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between font-bold">
              <p>{booking.service.name}</p>
              <p className="text-sm">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(booking.service.priceInCents / 100)}
              </p>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <p>Data</p>
              <p>
                {booking.date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                })}
              </p>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <p>Horário</p>
              <p>
                {booking.date.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <p>Barbearia</p>
              <p>{booking.barbershop.name}</p>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <p>Cliente</p>
              <p>{booking.clientName}</p>
            </div>
          </div>

          {booking.barbershop.phones.length > 0 && (
            <div className="space-y-3">
              {booking.barbershop.phones.map((phone, index) => (
                <PhoneItem key={index} phone={phone} />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 px-5 pb-6">
          <Button
            variant="ghost"
            className="flex-1 rounded-full cursor-pointer"
            onClick={() => setSheetIsOpen(false)}
          >
            Voltar
          </Button>
          {isConfirmed && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1 rounded-full cursor-pointer">
                  Cancelar Reserva
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar reserva</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja cancelar esta reserva? Esta ação não
                    pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="cursor-pointer rounded-full border-none"
                  >
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelBooking}
                    disabled={isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer rounded-full border-destructive"
                  >
                    {isPending ? "Cancelando..." : "Confirmar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
