import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "./_components/ui/sonner";
import QueryProvider from "./_providers/query-provider";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  weight: ["200","300","400","500","600","700","800"],
});

export const metadata: Metadata = {
  title: {
    default: "Barbearia Online | Agendamento de Corte, Barba e Serviços",
    template: "%s | Barber Cabeleireiro - Barbearia Online",
  },
  description: "Agende online corte de cabelo, barba, acabamento, sobrancelha, hidratação, progressiva e massagem. Barbearia especializada em serviços premium para homens.",
  keywords: [
    "barbearia online",
    "corte de cabelo",
    "corte e barba",
    "barbeiro",
    "agendamento online",
    "acabamento barba",
    "sobrancelha masculina",
    "hidratação cabelo",
    "progressiva",
    "massagem relaxante",
    "pézinho",
    "barbearia especializada",
  ],
  authors: [{ name: "Barber Cabeleireiro" }],
  openGraph: {
    title: "Barbearia Online | Corte, Barba, Hidratação e Mais",
    description: "Agende seus serviços de barbearia: corte, barba, sobrancelha, hidratação, progressiva, massagem. Qualidade e rapidez garantidas.",
    siteName: "Barber Cabeleireiro",
    locale: "pt_BR",
    type: "website",
    url: "https://seu-dominio.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${jakartaSans.variable} antialiased bg-white`}
        
      >
        <QueryProvider>
          {children}
          <Toaster 
            position="top-right"  
            richColors 
            expand={false}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
