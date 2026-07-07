"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, AlertCircle } from "lucide-react"
import { pizzeriaConfig } from "@/config/pizzeria.config"

interface WhatsAppModalProps {
  open: boolean
  onConfirm: (phoneNumber: string) => void
  onCancel: () => void
}

export function WhatsAppModal({ open, onConfirm, onCancel }: WhatsAppModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState("")

  // Cargar número guardado si existe
  useEffect(() => {
    if (open) {
      const savedPhone = localStorage.getItem("demoWhatsAppNumber")
      if (savedPhone) {
        setPhoneNumber(savedPhone)
      }
    }
  }, [open])

  const validatePhoneNumber = (phone: string): boolean => {
    // Remover espacios, guiones y paréntesis
    const cleaned = phone.replace(/[\s\-()]/g, "")
    
    // Validar que tenga 10 dígitos (formato México)
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(cleaned)
  }

  const handleConfirm = () => {
    setError("")
    
    if (!phoneNumber.trim()) {
      setError("Por favor ingresa un número de WhatsApp")
      return
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Ingresa un número válido de 10 dígitos (ej: 5512345678)")
      return
    }

    // Limpiar y formatear número
    const cleanedPhone = phoneNumber.replace(/[\s\-()]/g, "")
    
    // Guardar en localStorage para próximas pruebas
    localStorage.setItem("demoWhatsAppNumber", cleanedPhone)
    
    onConfirm(cleanedPhone)
  }

  const handlePhoneChange = (value: string) => {
    // Permitir solo números, espacios, guiones y paréntesis
    const filtered = value.replace(/[^0-9\s\-()]/g, "")
    setPhoneNumber(filtered)
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="h-6 w-6 text-primary" />
            Modo Demo - WhatsApp
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {pizzeriaConfig.demoMode.message}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-base">
              Número de WhatsApp *
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="5512345678"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="text-lg"
              maxLength={15}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Formato: 10 dígitos sin espacios (ej: 5512345678)
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>💡 Nota:</strong> Este número es solo para pruebas. En producción, 
              los pedidos se enviarán automáticamente al número configurado del negocio.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Recibir Pedido de Prueba
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
