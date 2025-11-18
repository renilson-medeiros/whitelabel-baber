"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchInput = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/services?search=${encodeURIComponent(search)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Pesquisar por serviços..."
        className="border-border rounded-full py-5"
        value={search}
        required
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        type="submit"
        variant="default"
        size="icon"
        className="rounded-full cursor-pointer"
      >
        <SearchIcon />
      </Button>
    </form>
  );
};

export default SearchInput;
