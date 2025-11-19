import Image from "next/image";
import Header from "./_components/header";
import banner from "../public/banner.png";
import bannerxl from "../public/banner_xl.png";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Footer from "./_components/footer";
import { ServiceItem } from "./_components/service-item";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
} from "./_components/ui/page";
import { PhoneItem } from "./_components/phone-item";
import { AddressItem } from "./_components/adress-item";
import SearchInput from "./_components/search-input";
import QuickSearchButtons from "./_components/quick-search-buttons";
import BookingItem from "./_components/booking-item";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const Home = async () => {
  const barbershop = await prisma.barbershop.findFirst({
    where: {
      id: process.env.DEFAULT_BARBERSHOP_ID, 
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) return <div>Barbearia não encontrada.</div>;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const bookings = session?.user
    ? await prisma.booking.findMany({
        where: { userId: session.user.id },
        include: { service: true, barbershop: true },
        orderBy: { date: "desc" },
      })
    : [];

  const now = new Date();
  
  const confirmedBookings = bookings.filter(
    (booking) => !booking.cancelled && !booking.finished && new Date(booking.date) >= now,).slice(0, 5);

  return (
    <main>
      <Header />

      <PageContainer>
        
        <SearchInput />

        <QuickSearchButtons />

        {/* Imagens do banner */}
        <Image
          src={banner}
          alt="Agende agora!"
          sizes="100vw"
          className="block h-auto w-full md:hidden"
        />
        <Image
          src={bannerxl}
          alt="Agende agora!"
          sizes="100vw"
          className="hidden md:block w-full h-auto"
        />

        {/* Agendamentos confirmados */}
        {confirmedBookings.length > 0 && (
          <div className="flex w-full flex-col items-start gap-3">
            <div className="flex w-full flex-col gap-3 ">
              <PageSection>
                <div className="flex flex-col gap-3 overflow-x-hidden">

                  <div className="flex justify-between">
                    <h2 className="text-foreground text-xs font-bold uppercase">
                      AGENDAMENTOS CONFIRMADOS
                    </h2>

                    <Link 
                      href="/bookings"
                      className="flex gap-2 text-muted-foreground hover:underline text-xs font-bold uppercase">
                      Ver todos
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <PageSectionScroller>
                      <div className="flex gap-4 w-full md:max-w-[400px]">
                        {confirmedBookings.map((booking) => (
                          <BookingItem key={booking.id} booking={booking} />
                        ))}
                      </div>
                    </PageSectionScroller>
                  </div>

                </div>
              </PageSection>
            </div>
          </div>
        )}

        {/* Serviços */}
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex items-center justify-center gap-2.5">
            <p className="text-foreground text-xs font-bold uppercase">
              SERVIÇOS OFERECIDOS
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {barbershop.services.map((service) => (
              <ServiceItem
                key={service.id}
                service={{ ...service, barbershop }}
              />
            ))}
          </div>
        </div>

        {/* Contato */}
        <div className="flex w-full flex-col items-start gap-3 mt-8 mb-5">
          <div className="flex items-center justify-center gap-2.5">
            <p className="text-foreground text-xs font-bold uppercase">
              CONTATO
            </p>
          </div>

          <div className="flex flex-col gap-5 w-full md:flex-row md:justify-between items-center">
            <div className="flex w-full flex-col gap-3">
              {barbershop.phones.map((phone, index) => (
                <PhoneItem key={index} phone={phone} />
              ))}
            </div>

            <div className="flex w-full flex-col gap-3">
              <AddressItem address={barbershop.address} />
            </div>  
          </div>
        </div>
        
      </PageContainer>

      <Footer />
    </main>
  );
};

export default Home;
