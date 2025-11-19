"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";
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
import { PageContainer } from "@/app/_components/ui/page";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import Image from "next/image";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");

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
    setImageFile(null);
    setImagePreview("");
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
    setImageFile(null);
    setImagePreview(service.imageUrl);
    setSheetOpen(true);
  };

  // 🔹 Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setForm((f) => ({ ...f, imageUrl: "" }));
  };

  // 🔹 Criar ou atualizar serviço
  const handleSave = async (data: Omit<Service, "id">) => {
    console.log("🔍 handleSave", { selectedService, data });

    setIsUploading(true);

    try {
      let imageUrl = data.imageUrl;

      // Upload image if new file selected
      if (imageFile) {

        console.log("📤 Iniciando upload...", imageFile);

        const uploadResult = await startUpload([imageFile]);

        console.log("📥 Resultado do upload:", uploadResult);


        if (!uploadResult || uploadResult.length === 0) {
          throw new Error("Falha no upload da imagem");
        }
        imageUrl = uploadResult[0].url;
        console.log("✅ URL da imagem:", imageUrl);
        toast.success("Imagem enviada com sucesso!");
      }

      const url = selectedService
        ? `/api/admin/services/${selectedService.id}`
        : "/api/admin/services";

      const method = selectedService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, imageUrl }),
      });

      console.log(`${method} response status:`, res.status);

      if (!res.ok) throw new Error(await res.text());

      toast.success(
        selectedService
          ? "Serviço atualizado com sucesso!"
          : "Serviço criado com sucesso!"
      );

      // fecha o drawer e recarrega
      setSheetOpen(false);
      setSelectedService(null);
      setImageFile(null);
      setImagePreview("");
      fetchServices();
    } catch (err) {
      console.error("Erro ao salvar serviço:", err);
      toast.error("Erro ao salvar serviço");
    } finally {
      setIsUploading(false);
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

      toast.success("Serviço excluído com sucesso!");
      setConfirmOpen(false);
      setDeleteId(null);
      fetchServices();
    } catch (err) {
      console.error("Erro ao excluir serviço:", err);
      toast.error("Erro ao excluir serviço");
    }
  };

  // 🔹 Render
  return (
    <main className="flex h-screen min-h-screen flex-col">
      <div className="flex-1">
        <PageContainer>
          <div className="space-y-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold">Serviços</h1>

              <Button
                className="rounded-full cursor-pointer text-sm flex gap-2 items-center w-full sm:w-auto"
                onClick={handleCreateService}
              >
                <Plus className="h-4 w-4" />
                <span>Novo Serviço</span>
              </Button>
            </div>

            <ul className="space-y-4">
              {services.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col justify-between border rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 relative">
                    <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-md overflow-hidden border">
                      <Image
                        src={s.imageUrl}
                        alt={s.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-1 flex-1 w-full">
                      <p className="font-semibold text-lg">{s.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {s.description}
                      </p>
                      <p className="font-bold mt-2">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(s.priceInCents / 100)}
                      </p>
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                      <Button
                        className="cursor-pointer flex-1 sm:flex-none rounded-full"
                        variant="outline"
                        onClick={() => handleEdit(s)}
                      >
                        <Pencil className="w-4 h-4 sm:mr-0" />
                        <span className="sm:hidden ml-2">Editar</span>
                      </Button>

                      <Button
                        className="cursor-pointer flex-1 sm:flex-none rounded-full"
                        variant="destructive"
                        onClick={() => handleDeleteRequest(s.id)}
                      >
                        <Trash2 className="w-4 h-4 sm:mr-0" />
                        <span className="sm:hidden ml-2">Excluir</span>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {services.length === 0 && (
              <p className="text-center text-muted-foreground bg-card border border-border rounded-xl py-4">
                Nenhum serviço cadastrado
              </p>
            )}
          </div>
        </PageContainer>
      </div>

      <Footer />

      <ConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir serviço"
        message="Essa ação não poderá ser desfeita."
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:w-[370px] overflow-y-auto p-0">
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
              <Label>Imagem do serviço</Label>

              {imagePreview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 rounded-full cursor-pointer"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Clique para fazer upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG até 4MB
                  </p>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
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

          <SheetFooter className="px-5 pb-6">
            <Button
              className="w-full rounded-full cursor-pointer"
              onClick={() => handleSave({ ...form })}
              disabled={isUploading || !form.name || (!imagePreview && !imageFile)}
            >
              {isUploading ? "Salvando..." : "Salvar"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </main>
  );
}