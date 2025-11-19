"use client";

import { useEffect, useRef, useState } from "react";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-6 p-5 flex-1 container mx-auto">{children}</div>;
};

export const PageSectionTitle = ({ children }: { children: string }) => {
  return (
    <h2 className="text-foreground text-xs font-semibold uppercase">
      {children}
    </h2>
  );
};

export const PageSection = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-3">{children}</div>;
};

export const PageSectionScroller = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;

      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div className="relative w-full pl-[0.5px] pr-[1px]">

      <div
        ref={scrollRef}
        className="
          flex gap-4 
          overflow-x-auto
          [&::-webkit-scrollbar]:hidden 
          md:flex-nowrap
        "
      >
        {children}
      </div>

      {/* Fade esquerda */}
      <div
        className={`
          pointer-events-none absolute z-50 left-0 top-0 h-full w-20  
          bg-linear-to-r from-white/90 to-transparent dark:from-gray-900/80 
          transition-opacity duration-300
          ${showLeft ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Fade direita */}
      <div
        className={`
          pointer-events-none absolute right-0 top-0 h-full w-20 
          bg-linear-to-l from-white/90 to-transparent dark:from-gray-900/80
          transition-opacity duration-300
          ${showRight ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  );
};
