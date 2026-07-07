"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pizza3x1Card } from "@/components/pizza-3x1-card"

interface Pizza3x1ModalProps {
  isOpen: boolean
  onClose: () => void
  pizza: {
    name: string
    ingredients: string
    prices: { CH: number; MED: number; GDE: number; FAM: number }
  } | null
  allEspecialidades: string[]
}

export function Pizza3x1Modal({ isOpen, onClose, pizza, allEspecialidades }: Pizza3x1ModalProps) {
  if (!pizza) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Promoción 3x1</DialogTitle>
        </DialogHeader>
        <Pizza3x1Card especialidad={pizza} allEspecialidades={allEspecialidades} />
      </DialogContent>
    </Dialog>
  )
}
