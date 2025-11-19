"use client";

import { updateBookingStatus } from "@/app/_actions/update-booking-status";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { useEffect, useState } from "react";
import { PageContainer, PageSectionScroller } from "@/app/_components/ui/page";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Footer from "@/app/_components/footer";
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
} from "@/app/_components/ui/alert-dialog";
import Link from "next/link";

interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string;
  service: {
    priceInCents: number;
    name: string;
  };
  finished: boolean;
  cancelled: boolean;
}

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  const formattedDate = currentDate.toISOString().split("T")[0];

  useEffect(() => {
    fetch(`/api/admin/bookings/${formattedDate}`)
      .then((res) => res.json())
      .then((data) =>
        setBookings(
          data.bookings.sort(
            (a: Booking, b: Booking) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        )
      );
  }, [formattedDate]);

  const changeDay = (days: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  const handleBookingAction = async (id: string, action: "finish" | "cancel") => {
    setIsProcessing(true);
    try {
      await updateBookingStatus({ bookingId: id, action });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                finished: action === "finish",
                cancelled: action === "cancel",
              }
            : b
        )
      );

      if (action === "finish") {
        toast.success("Agendamento finalizado com sucesso!");
      } else {
        toast.success("Agendamento cancelado com sucesso!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?._errors?.[0] || "Erro ao atualizar reserva");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmed = bookings.filter((b) => !b.finished && !b.cancelled);
  const finished = bookings.filter((b) => b.finished);
  const cancelled = bookings.filter((b) => b.cancelled);

  // Desabilita o botão de voltar para datas anteriores ao dia atual
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentDateNormalized = new Date(currentDate);
  currentDateNormalized.setHours(0, 0, 0, 0);

  const isToday = currentDateNormalized.getTime() === today.getTime();

  return (
    <main className="flex h-screen min-h-screen flex-col">
      <PageContainer>
        <div className="flex-1 mx-auto space-y-6">
          
          <div className="flex justify-between items-baseline-last flex-1 w-full">
            <h1 className="text-2xl font-bold">Agendamentos</h1>

            <Link href="/admin/services">
              <p className="text-sm text-muted-foreground hover:underline">
                Gerenciar Serviços
              </p>
            </Link>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => changeDay(-1)}
              disabled={isToday}
            >
              <ArrowLeft />
            </Button>

            <h1 className="text-sm uppercase font-semibold">
              {currentDate.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </h1>

            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => changeDay(1)}
            >
              <ArrowRight />
            </Button>
          </div>

          {/* CONFIRMADOS */}
{confirmed.length > 0 && (
  <section className="my-8">
    <h2 className="text-sm mb-3 font-semibold uppercase">Confirmados</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {confirmed.map((b) => (
        <div
          key={b.id}
          className="bg-card space-y-3 rounded-xl border border-border p-4"
        >
          <Badge className="bg-primary/10 text-primary">CONFIRMADO</Badge>

          <div className="flex justify-between font-bold text-lg">
            <p>{b.service.name}</p>
            <p>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(b.service.priceInCents / 100)}
            </p>
          </div>

          <p className="text-muted-foreground">Cliente: {b.clientName}</p>

          <p className="text-muted-foreground">
            Horário:{" "}
            {new Date(b.date).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {/* BOTÃO FINALIZAR */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="rounded-full w-full sm:flex-1 cursor-pointer"
                  disabled={isProcessing}
                >
                  Finalizar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Finalizar agendamento</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja finalizar este agendamento? Esta
                    ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer rounded-full border-none">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleBookingAction(b.id, "finish")}
                    className="cursor-pointer rounded-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Finalizando..." : "Confirmar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* BOTÃO CANCELAR */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="rounded-full w-full sm:flex-1 bg-destructive border-destructive cursor-pointer hover:bg-destructive/90"
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja cancelar este agendamento? Esta
                    ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer rounded-full border-none">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleBookingAction(b.id, "cancel")}
                    className="bg-destructive text-destructive-foreground border border-destructive hover:bg-destructive/90 cursor-pointer rounded-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Cancelando..." : "Confirmar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

          {/* FINALIZADOS */}
          {finished.length > 0 && (
            <section className="my-8">
              <h2 className="text-sm mb-3 font-semibold uppercase">Finalizados</h2>

              <div className="flex space-y-4">
                <PageSectionScroller>
                  {finished.map((b) => (
                    <div
                      key={b.id}
                      className="bg-card w-full min-w-80 max-w-96 space-y-3 rounded-xl border border-border p-4 opacity-70"
                    >
                      <Badge className="bg-blue-100 text-blue-600">FINALIZADO</Badge>

                      <div className="flex justify-between font-bold text-lg">
                        <p>{b.service.name}</p>
                      </div>

                      <p className="text-muted-foreground">Cliente: {b.clientName}</p>
                      <p className="text-muted-foreground">
                        Horário:{" "}
                        {new Date(b.date).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </PageSectionScroller>
              </div>
            </section>
          )}

          {/* CANCELADOS */}
          {cancelled.length > 0 && (
            <section className="my-8">
              <h2 className="text-sm mb-3 font-semibold uppercase">Cancelados</h2>

              <div className="flex space-y-4">
                <PageSectionScroller>
                  {cancelled.map((b) => (
                    <div
                      key={b.id}
                      className="bg-card w-full min-w-80 max-w-96 space-y-3 rounded-xl border border-border p-4 opacity-70"
                    >
                      <Badge className="bg-red-100 text-red-600">CANCELADO</Badge>

                      <div className="flex justify-between font-bold text-lg">
                        <p>{b.service.name}</p>
                      </div>

                      <p className="text-muted-foreground">Cliente: {b.clientName}</p>
                      <p className="text-muted-foreground">
                        Horário:{" "}
                        {new Date(b.date).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </PageSectionScroller>
              </div>
            </section>
          )}

          {bookings.length === 0 && (
            <p className="text-center text-muted-foreground bg-card border border-border rounded-xl py-4">
              Nenhum agendamento para hoje
            </p>
          )}
        </div>
      </PageContainer>

      <Footer />
    </main>
  );
}