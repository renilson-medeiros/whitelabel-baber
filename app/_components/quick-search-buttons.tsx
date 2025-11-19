import { Eye, Footprints, Scissors, Sparkles, User, Waves, Hand } from "lucide-react";
import Link from "next/link";
import { PageSectionScroller } from "./ui/page";

const QUICK_SEARCH_LINKS = [
  { label: "Corte", search: "corte", icon: Scissors },
  { label: "Barba", search: "barba", icon: User },
  { label: "Corte & Barba", search: "corte & barba", icon: Scissors },
  { label: "Acabamento", search: "acabamento", icon: Sparkles },
  { label: "Sobrancelha", search: "sobrancelha", icon: Eye },
  { label: "Hidratação", search: "hidratação", icon: Waves },
  { label: "Pézinho", search: "pézinho", icon: Footprints },
  { label: "Massagem", search: "massagem", icon: Hand },
  { label: "Progressiva", search: "progressiva", icon: Waves },
];

const QuickSearchButtons = () => {
  return (
    <PageSectionScroller>
      {QUICK_SEARCH_LINKS.map(({ label, search, icon: Icon }) => (
        <Link
          key={search}
          href={`/services?search=${search}`}
          className="
            flex shrink-0 items-center justify-center gap-3 rounded-3xl border px-4 py-2
            border-border bg-card text-card-foreground text-sm font-medium
            cursor-pointer transition-colors duration-200
            hover:bg-black/10 hover:text-accent-foreground
          "
        >
          <Icon className="size-4" />
          <span>{label}</span>
        </Link>
      ))}
    </PageSectionScroller>
  );
};

export default QuickSearchButtons;
