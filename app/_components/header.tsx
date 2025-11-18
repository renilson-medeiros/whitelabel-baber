"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import SidebarMenu from "./sidebar-menu";
import Link from "next/link"

const Header = () => {
  return (
    <header className="flex items-center justify-between px-5 pt-6">

      <Link href="/">
        <Image src="/logo.svg" alt="Barber" width={219} height={30} />
      </Link>
      
      <div className="flex items-center gap-2">

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[370px] p-0">
            <SheetHeader className="border-b px-5 py-6 text-left">
              <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
            </SheetHeader>
            <SidebarMenu />
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
};

export default Header;
