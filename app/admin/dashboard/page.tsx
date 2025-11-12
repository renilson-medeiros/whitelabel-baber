import { PageContainer } from "@/app/_components/ui/page";
import { Footer } from "react-day-picker";

export default function Dashboard() {

  return (

    <main className="flex h-screen min-h-screen flex-col">

      <div className="flex-1">
        <PageContainer>
      
          <h1 className="text-foreground text-xl font-bold my-6">Dashboard</h1>

          <section>
            <div>
              dados do dashboard
            </div>
          </section>

        </PageContainer>
      </div>

      <Footer />
    </main>

  )

}
