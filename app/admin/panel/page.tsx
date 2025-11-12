"use client";

import { updateBookingStatus } from "@/app/_actions/update-booking-status";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { useEffect, useState } from "react";
import { PageContainer, PageSectionScroller } from "@/app/_components/ui/page";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Footer from "@/app/_components/footer";

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

  const formattedDate = currentDate.toISOString().split("T")[0]

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
      const newDate = new Date(prev)

      newDate.setDate(prev.getDate() + days)

      return newDate
    })
  }

  const handleBookingAction = async (id: string, action: "finish" | "cancel") => {
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
    } catch (err: any) {
      console.error(err);
      alert(err?._errors?.[0] || "Erro ao atualizar reserva");
    }
  };

  const confirmed = bookings.filter((b) => !b.finished && !b.cancelled);
  const finished = bookings.filter((b) => b.finished);
  const cancelled = bookings.filter((b) => b.cancelled);

  return (
    <main className="flex h-screen min-h-screen flex-col">

      <PageContainer>
        <div className="flex-1 mx-auto space-y-6">

          <h1 className="text-2xl font-bold">Agendamentos do dia</h1>

          <div className="flex justify-between items-center">

            <Button 
              variant="ghost"
              className="cursor-pointer" 
              onClick={() => changeDay(-1)}
            >
              <ArrowLeft />
            </Button>

            <h1 className="text-sm uppercase font-semibold">
              {currentDate.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
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
              <h2 className="text-sm mb-3 font-semibold uppercase">
                Confirmados
              </h2>

              <div className="space-y-4">
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

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="rounded-full px-6 cursor-pointer"
                        onClick={() => handleBookingAction(b.id, "finish")}
                      >
                        Finalizar
                      </Button>
                      <Button
                        className="rounded-full bg-destructive border-destructive px-6 cursor-pointer hover:bg-destructive/90"
                        onClick={() => handleBookingAction(b.id, "cancel")}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FINALIZADOS */}
          {finished.length > 0 && (
            <section className="my-8">
              <h2 className="text-sm mb-3 font-semibold uppercase">
                Finalizados
              </h2>

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
              <h2 className="text-sm mb-3 font-semibold uppercase">
                Cancelados
              </h2>

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
