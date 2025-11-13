"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  CalendarDaysIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SheetClose } from "./ui/sheet";

const CATEGORY_LINKS = [
  { label: "Cabelo", search: "cabelo" },
  { label: "Barba", search: "barba"},
  { label: "Cabelo & Barba", search: "cabelo e barba" },
  { label: "Acabamento", search: "acabamento"},
  { label: "Sobrancelha", search: "sobrancelha"},
  { label: "Hidratação", search: "hidratação"},
  { label: "Pézinho", search: "pézinho"},
  { label: "Massagem", search: "massagem" },
  { label: "Progressiva", search: "progressiva"}
];

const CategoryItem = ({ label, search }: { label: string; search: string }) => (
  <Link href={`/barbershops?search=${search}`} className="cursor-pointer">
    <Button
      variant="ghost"
      className="
        w-full justify-start rounded-full px-5 py-3 h-10 
        text-sm font-medium cursor-pointer
        transition-colors duration-200
        hover:bg-black/10 hover:text-accent-foreground
      "
    >
      {label}
    </Button>
  </Link>
);

const SidebarMenu = () => {
  const { data: session } = authClient.useSession();

  const handleLogin = async () => {
    await authClient.signIn.social({ provider: "google" });
  };

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <div className="flex h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden flex-col gap-6 py-2">

      {/* User Section */}
      <div className="px-2">
        {session?.user ? (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
            <Avatar className="size-12 cursor- rounded-xl">
              <AvatarImage src={session.user.image ?? ""} />
              <AvatarFallback>
                {session.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col leading-tight">
              <p className="text-base font-semibold">{session.user.name}</p>
              <p className="text-muted-foreground text-xs">{session.user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-14 items-center justify-between">
            <p className="text-base font-semibold">Olá. Faça seu login!</p>

            <Button
              onClick={handleLogin}
              className="gap-3 flex-1 rounded-full py-3 cursor-pointer"
            >
              <span className="text-sm font-semibold">Login</span>
              <LogInIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col px-2">
        <SheetClose asChild>
          <Link href="/" className="cursor-pointer">
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-3 rounded-full px-5 py-3 cursor-pointer"
            >
              <HomeIcon className="size-4" />
              <span className="text-sm font-medium">Início</span>
            </Button>
          </Link>
        </SheetClose>

        <SheetClose asChild>
          <Link href="/bookings" className="cursor-pointer">
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-3 rounded-full px-5 py-3 cursor-pointer"
            >
              <CalendarDaysIcon className="size-4" />
              <span className="text-sm font-medium">Agendamentos</span>
            </Button>
          </Link>
        </SheetClose>
      </div>

      <Separator />

      {/* Category Buttons */}
      <div className="flex flex-col gap-1 px-2">
        {CATEGORY_LINKS.map(({ label, search }) => (
          <CategoryItem key={search} label={label} search={search} />
        ))}
      </div>

      <Separator />

      {/* Logout */}
      {session?.user && (
        <SheetClose asChild>
          <div className="px-2">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 rounded-full py-3 text-destructive cursor-pointer"
            >
              <LogOutIcon className="size-4" />
              <span className="text-sm font-medium">Sair da conta</span>
            </Button>
          </div>
        </SheetClose>
      )}
    </div>
  );
};

export default SidebarMenu;
