"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm space-y-2 flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground text-center">{message}</p>

        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>

          <Button className="rounded-full" variant="destructive" onClick={onConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
