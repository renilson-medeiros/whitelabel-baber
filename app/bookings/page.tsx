import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "../_components/header";
import Footer from "../_components/footer";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "../_components/ui/page";
import BookingItem from "../_components/booking-item";
import { Badge } from "../_components/ui/badge";

const BookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      service: true,
      barbershop: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const now = new Date();

  const confirmedBookings = bookings.filter(
    (booking) => !booking.cancelled && !booking.finished && new Date(booking.date) >= now,
  );

  const finishedBookings = bookings.filter((booking) => booking.finished);

  const cancelledBookings = bookings.filter((booking) => booking.cancelled);

  const renderBadge = (booking: typeof bookings[0]) => {
    if (booking.finished) {
      return <Badge className="bg-blue-100 text-blue-600 uppercase">Finalizado</Badge>;
    }
    if (booking.cancelled) {
      return <Badge className="bg-red-100 text-red-600 uppercase">Cancelado</Badge>;
    }
    return <Badge className="bg-green-100 text-green-600 uppercase">Confirmado</Badge>;
  };

  return (
    <main className="flex h-screen min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <PageContainer>
          <h1 className="text-foreground text-xl font-bold my-6">Agendamentos</h1>

          {confirmedBookings.length > 0 && (
            <PageSection>
              <PageSectionTitle>Confirmados</PageSectionTitle>
              <div className="space-y-3">
                {confirmedBookings.map((booking) => (
                  <BookingItem
                    key={booking.id}
                    booking={booking}
                    badge={renderBadge(booking)}
                  />
                ))}
              </div>
            </PageSection>
          )}

          {finishedBookings.length > 0 && (
            <PageSection>
              <PageSectionTitle>Finalizados</PageSectionTitle>
              <div className="space-y-3">
                <PageSectionScroller>
                  {finishedBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={booking}
                      badge={renderBadge(booking)}
                    />
                  ))}
                </PageSectionScroller>
              </div>
            </PageSection>
          )}

          {cancelledBookings.length > 0 && (
            <PageSection>
              <PageSectionTitle>Cancelados</PageSectionTitle>
              <div className="space-y-3 opacity-70">
                <PageSectionScroller>
                  {cancelledBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={booking}
                      badge={renderBadge(booking)}
                    />
                  ))}
                </PageSectionScroller>
              </div>
            </PageSection>
          )}

          {bookings.length === 0 && (
            <p className="text-muted-foreground text-center text-sm">
              Você ainda não tem agendamentos.
            </p>
          )}
        </PageContainer>
      </div>
      <Footer />
    </main>
  );
};

export default BookingsPage;
