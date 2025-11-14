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
  title: "Anderson Cabeleireiro",
  description: "Anderson Cabeleireiro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
