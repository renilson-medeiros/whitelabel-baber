"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ConfirmModal } from "../../_components/confirm-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/app/_components/ui/sheet";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import Footer from "@/app/_components/footer";

interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceInCents: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Service, "id">>({
    name: "",
    description: "",
    imageUrl: "",
    priceInCents: 0,
  });

  // 🔹 Buscar todos os serviços
  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services", { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao buscar serviços");
      const data = await res.json();
      setServices(data.services ?? []);
    } catch (error) {
      console.error("Erro no fetch:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🔹 Abrir o drawer para criar novo
  const handleCreateService = () => {
    setSelectedService(null);
    setForm({ name: "", description: "", imageUrl: "", priceInCents: 0 });
    setSheetOpen(true);
  };

  // 🔹 Abrir o drawer para editar existente
  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setForm({
      name: service.name,
      description: service.description,
      imageUrl: service.imageUrl,
      priceInCents: service.priceInCents,
    });
    setSheetOpen(true);
  };

  // 🔹 Criar ou atualizar serviço
  const handleSave = async (data: Omit<Service, "id">) => {
    console.log("🔍 handleSave", { selectedService, data });

    try {
      const url = selectedService
        ? `/api/admin/services/${selectedService.id}`
        : "/api/admin/services";

      const method = selectedService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log(`${method} response status:`, res.status);

      if (!res.ok) throw new Error(await res.text());

      // fecha o drawer e recarrega
      setSheetOpen(false);
      setSelectedService(null);
      fetchServices();
    } catch (err) {
      console.error("Erro ao salvar serviço:", err);
    }
  };

  // 🔹 Solicitar confirmação de exclusão
  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  // 🔹 Confirmar exclusão
  const confirmDelete = async () => {
    console.log("🗑 confirmDelete", { deleteId });

    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/services/${deleteId}`, {
        method: "DELETE",
      });

      console.log("DELETE response status:", res.status);
      if (!res.ok) throw new Error(await res.text());

      setConfirmOpen(false);
      setDeleteId(null);
      fetchServices();
    } catch (err) {
      console.error("Erro ao excluir serviço:", err);
    }
  };

  // 🔹 Render
  return (
    <div className="max-w-3xl mx-auto">
      <div className="p-6 space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Serviços</h1>

          <Button className="rounded-full cursor-pointer text-sm flex gap-2 items-center" onClick={handleCreateService}>
            <Plus className="h-4 w-4" /> 
            <span>Novo Serviço</span>
          </Button>
        </div>

        <ul className="space-y-5">
          {services.map((s) => (
            <li
              key={s.id}
              className="flex flex-col justify-between border rounded-lg p-3"
            >
              <div className="flex items-start gap-4 relative">
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  className="w-24 h-24 rounded-md object-cover border"
                />

                <div className="flex flex-col gap-1 flex-1">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {s.description}
                  </p>
                  <p className="font-bold">
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(s.priceInCents / 100)}
                  </p>
                </div>

                <div className="absolute right-1 bottom-0 flex gap-2">
                  <Button
                    className="cursor-pointer"
                    variant="outline" 
                    onClick={() => handleEdit(s)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    className="cursor-pointer"
                    variant="destructive"
                    onClick={() => handleDeleteRequest(s.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <ConfirmModal
                  open={confirmOpen}
                  onCancel={() => setConfirmOpen(false)}
                  onConfirm={confirmDelete}
                  title="Excluir serviço"
                  message="Essa ação não poderá ser desfeita."
                />
              </div>
            </li>
          ))}
        </ul>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="w-[370px] overflow-y-auto p-0">
            <SheetHeader className="px-5 pt-6">
              <SheetTitle className="text-lg font-bold">
                {selectedService ? "Editar serviço" : "Novo serviço"}
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6 flex-1 px-5 py-6">
              <div className="space-y-3">
                <Label htmlFor="name">Serviço</Label>
                <Input
                  id="name"
                  className="border-black/10 py-5"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  rows={3}
                  className="border-black/10 py-3"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="imageUrl">URL da imagem</Label>
                <Input
                  id="imageUrl"
                  className="border-black/10 py-5"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="priceInCents">Preço (em centavos)</Label>
                <Input
                  id="priceInCents"
                  type="number"
                  className="border-black/10 py-5"
                  value={form.priceInCents}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      priceInCents: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <SheetFooter>
              <Button
                className="w-full rounded-full cursor-pointer"
                onClick={() => handleSave({ ...form })}
              >
                Salvar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <Footer />
    </div>
  );
}
