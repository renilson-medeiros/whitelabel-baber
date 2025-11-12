"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ClientInfoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string, phone: string) => void;
}

export default function ClientInfoModal({ open, onClose, onConfirm }: ClientInfoModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!open) return null;

  const handlePhoneChange = (value: string) => {
    // Remove tudo que não for número
    let cleaned = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    cleaned = cleaned.slice(0, 11);

    // Aplica a máscara dinamicamente
    if (cleaned.length <= 2) {
      setPhone(`(${cleaned}`);
    } else if (cleaned.length <= 7) {
      setPhone(`(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`);
    } else {
      setPhone(
        `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
      );
    }
  };

  const handleConfirm = () => {
    if (!name.trim() || !phone.trim()) return alert("Preencha nome e telefone.");
    onConfirm(name, phone);
    setName("");
    setPhone("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl flex flex-col gap-4">
        <h2 className="text-lg font-bold">Seu contato</h2>

        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-black/10 py-5 rounded-full"
          />

          <Input
            type="text"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="w-full border border-black/10 py-5 rounded-full"
            maxLength={15} // evita quebrar layout
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-black text-white py-2 rounded-full"
          >
            Confirmar
          </Button>

          <Button onClick={onClose} className="flex-1 py-2 rounded-full" variant="ghost">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
