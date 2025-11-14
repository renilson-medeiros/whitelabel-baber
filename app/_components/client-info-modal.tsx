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
  const [errors, setErrors] = useState({ name: false, phone: false });

  if (!open) return null;

  const handlePhoneChange = (value: string) => {
    // Remove o erro ao começar a digitar
    if (errors.phone) setErrors({ ...errors, phone: false });

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

  const handleNameChange = (value: string) => {
    // Remove o erro ao começar a digitar
    if (errors.name) setErrors({ ...errors, name: false });
    setName(value);
  };

  const handleConfirm = () => {
    const newErrors = {
      name: !name.trim(),
      phone: !phone.trim() || phone.replace(/\D/g, "").length < 10,
    };

    setErrors(newErrors);

    // Se tiver algum erro, não continua
    if (newErrors.name || newErrors.phone) return;

    onConfirm(name, phone);
    setName("");
    setPhone("");
    setErrors({ name: false, phone: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl flex flex-col gap-4">
        <h2 className="text-lg font-bold">Seu contato</h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full border py-5 rounded-full ${
                errors.name 
                  ? "border-red-500 focus-visible:ring-red-500" 
                  : "border-black/10"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs px-4">Por favor, preencha seu nome</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Input
              type="text"
              placeholder="Telefone"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full border py-5 rounded-full ${
                errors.phone 
                  ? "border-red-500 focus-visible:ring-red-500" 
                  : "border-black/10"
              }`}
              maxLength={15}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs px-4">
                {!phone.trim() 
                  ? "Por favor, preencha seu telefone" 
                  : "Telefone inválido (mínimo 10 dígitos)"}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-black text-white py-2 rounded-full cursor-pointer"
          >
            Confirmar
          </Button>

          <Button 
            onClick={onClose} 
            className="flex-1 py-2 rounded-full cursor-pointer" 
            variant="ghost"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}