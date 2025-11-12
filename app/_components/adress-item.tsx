"use client";

import { MapPin } from "lucide-react";

interface AddressItemProps {
  address: string;
}

export function AddressItem({ address }: AddressItemProps) {
  const handleOpenMaps = () => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div
      className="flex w-full items-center gap-2.5 cursor-pointer"
      onClick={handleOpenMaps}
    >
      <MapPin className="size-6" />
      <p className="text-sm text-foreground underline flex-1">{address}</p>
    </div>
  );
}
