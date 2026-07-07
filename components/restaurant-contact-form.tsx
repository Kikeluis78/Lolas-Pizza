"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, Phone, Store } from "lucide-react"

interface ContactInfo {
  name: string
  phone: string
}

export function RestaurantContactForm() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ name: "", phone: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Verificar si hay usuario registrado
    const userAccount = localStorage.getItem("userAccount")
    if (userAccount) {
      const user = JSON.parse(userAccount)
      setContactInfo({
        name: user.name || "",
        phone: user.phone || ""
      })
      return
    }

    // Verificar si hay contacto de invitado guardado
    const guestContact = localStorage.getItem("guestContact")
    if (guestContact) {
      setContactInfo(JSON.parse(guestContact))
    } else {
      setIsEditing(true) // Si no hay datos, activar edición
    }
  }, [])

  const handleSave = () => {
    if (contactInfo.name.trim() && contactInfo.phone.trim()) {
      localStorage.setItem("guestContact", JSON.stringify(contactInfo))
      setIsEditing(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  if (!mounted) return null

  const hasData = contactInfo.name.trim() && contactInfo.phone.trim()

  return (
    <Card className="border-2 border-secondary/20 bg-gradient-to-br from-card to-secondary/5 shadow-lg" data-contact-form>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Store className="h-5 w-5 text-secondary" />
          Datos de Contacto
        </CardTitle>
        <CardDescription>
          Para contactarte cuando tu pedido esté listo para recoger
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nombre completo *
              </Label>
              <Input
                id="contact-name"
                type="text"
                placeholder="Juan Pérez"
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Teléfono *
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="5512345678"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="border-2"
              />
              <p className="text-xs text-muted-foreground">
                Te contactaremos si hay algún retraso o cuando esté listo
              </p>
            </div>
            <Button 
              onClick={handleSave}
              disabled={!contactInfo.name.trim() || !contactInfo.phone.trim()}
              className="w-full gradient-secondary shadow-md hover:shadow-glow font-bold"
            >
              Guardar Datos
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Nombre</p>
                  <p className="font-bold">{contactInfo.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="font-bold">{contactInfo.phone}</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleEdit}
              variant="outline"
              className="w-full border-2"
            >
              Editar Datos
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function getContactInfo(): ContactInfo | null {
  if (typeof window === "undefined") return null
  
  // Primero verificar usuario registrado
  const userAccount = localStorage.getItem("userAccount")
  if (userAccount) {
    const user = JSON.parse(userAccount)
    if (user.name && user.phone) {
      return { name: user.name, phone: user.phone }
    }
  }

  // Luego verificar contacto de invitado
  const guestContact = localStorage.getItem("guestContact")
  if (guestContact) {
    const contact = JSON.parse(guestContact)
    if (contact.name && contact.phone) {
      return contact
    }
  }

  return null
}
