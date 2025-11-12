import { prisma } from "@/lib/prisma";
import Footer from "../_components/footer";
import Header from "../_components/header";
import QuickSearchButtons from "../_components/quick-search-buttons";
import SearchInput from "../_components/search-input";
import { PageContainer } from "../_components/ui/page";
import { ServiceItem } from "../_components/service-item";

const ServicesPage = async ({ searchParams }: PageProps<"/services">) => {
  const { search } = await searchParams;

  const services = search
    ? await prisma.barbershopService.findMany({
        where: {
          name: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        include: {
          barbershop: true,
        },
        orderBy: {
          name: "asc",
        },
      })
    : [];

  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      <PageContainer>
        <SearchInput />
        <QuickSearchButtons />

        {search && (
          <div className="mt-6 flex flex-1 flex-col">
            <h2 className="text-muted-foreground mb-4 text-sm font-semibold uppercase">
              Resultados para &quot;{search}&quot;
            </h2>

            {services.length > 0 ? (
              <div className="flex flex-col gap-4">
                {services.map((service) => (
                  <ServiceItem key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">
                Nenhum serviço encontrado.
              </p>
            )}
          </div>
        )}
      </PageContainer>

      <Footer />
    </main>
  );
};

export default ServicesPage;
