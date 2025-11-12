"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; priceInCents: number }) => void;
  defaultValues?: { name: string; priceInCents: number } | null;
}

export function ServiceModal({ open, onClose, onSave, defaultValues }: ServiceModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name);
      setPrice((defaultValues.priceInCents / 100).toString());
    } else {
      setName("");
      setPrice("");
    }
  }, [defaultValues]);

  const handleSubmit = () => {
    onSave({
      name,
      priceInCents: Number(price) * 100,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Editar serviço" : "Novo serviço"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Input
              placeholder="Nome do serviço"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Input
              type="number"
              placeholder="Preço (R$)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="rounded-full px-6">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
