"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Plus, Edit, Trash2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

interface Address {
  id: string
  userName: string
  addressType: "casa" | "departamento" | "oficina" | "trabajo" | "otro"
  otherDescription?: string // Descripción cuando addressType es "otro"
  street: string
  number: string
  neighborhood: string
  postalCode: string
  phone: string
  references: string
  isMain: boolean
}

export function AddressManager() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Address, "id" | "isMain">>({
    userName: "",
    addressType: "casa",
    otherDescription: "",
    street: "",
    number: "",
    neighborhood: "",
    postalCode: "",
    phone: "",
    references: "",
  })

  useEffect(() => {
    const savedAddresses = localStorage.getItem("deliveryAddresses")
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses))
    }

    const userAccount = localStorage.getItem("userAccount")
    if (userAccount) {
      const account = JSON.parse(userAccount)
      setFormData((prev) => ({ ...prev, userName: account.name, phone: account.phone }))
    }
  }, [])

  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses)
    localStorage.setItem("deliveryAddresses", JSON.stringify(newAddresses))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar máximo 2 direcciones
    if (!editingId && addresses.length >= 2) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: "Solo puedes tener máximo 2 direcciones guardadas. Elimina una para agregar otra.",
      })
      return
    }

    if (
      !formData.userName ||
      !formData.street ||
      !formData.number ||
      !formData.neighborhood ||
      !formData.postalCode ||
      !formData.phone
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor completa todos los campos obligatorios",
      })
      return
    }

    // Validar que si es "otro", tenga descripción
    if (formData.addressType === "otro" && !formData.otherDescription?.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor especifica el tipo de dirección",
      })
      return
    }

    if (editingId) {
      const updatedAddresses = addresses.map((addr) =>
        addr.id === editingId ? { ...formData, id: addr.id, isMain: addr.isMain } : addr,
      )
      saveAddresses(updatedAddresses)
      setEditingId(null)
      Swal.fire({
        icon: "success",
        title: "Dirección actualizada",
        timer: 1500,
        showConfirmButton: false,
      })
    } else {
      const newAddress: Address = {
        ...formData,
        id: Date.now().toString(),
        isMain: addresses.length === 0,
      }
      saveAddresses([...addresses, newAddress])
      Swal.fire({
        icon: "success",
        title: "Dirección guardada",
        timer: 1500,
        showConfirmButton: false,
      })
    }

    setShowForm(false)
    resetForm()
  }

  const resetForm = () => {
    const userAccount = localStorage.getItem("userAccount")
    const account = userAccount ? JSON.parse(userAccount) : {}
    setFormData({
      userName: account.name || "",
      addressType: "casa",
      otherDescription: "",
      street: "",
      number: "",
      neighborhood: "",
      postalCode: "",
      phone: account.phone || "",
      references: "",
    })
  }

  const handleEdit = (address: Address) => {
    setFormData({
      userName: address.userName,
      addressType: address.addressType,
      otherDescription: address.otherDescription || "",
      street: address.street,
      number: address.number,
      neighborhood: address.neighborhood,
      postalCode: address.postalCode,
      phone: address.phone,
      references: address.references,
    })
    setEditingId(address.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "¿Eliminar dirección?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const newAddresses = addresses.filter((addr) => addr.id !== id)
        saveAddresses(newAddresses)
        Swal.fire({
          icon: "success",
          title: "Dirección eliminada",
          timer: 1500,
          showConfirmButton: false,
        })
      }
    })
  }

  const handleSetMain = (id: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isMain: addr.id === id,
    }))
    saveAddresses(updatedAddresses)
  }

  const handleUseLast = () => {
    if (addresses.length > 0) {
      const lastAddress = addresses[addresses.length - 1]
      localStorage.setItem("selectedAddress", JSON.stringify(lastAddress))
      router.push("/pizzas")
    }
  }

  const handleContinue = () => {
    if (addresses.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin dirección",
        text: "Por favor agrega una dirección de entrega",
      })
      return
    }

    const mainAddress = addresses.find((addr) => addr.isMain) || addresses[0]
    localStorage.setItem("selectedAddress", JSON.stringify(mainAddress))
    router.push("/pizzas")
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Direcciones Guardadas</h2>
          {addresses.map((address) => (
            <Card key={address.id} className={address.isMain ? "border-primary border-2" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-card-foreground">{address.userName}</span>
                      <span className="text-sm text-muted-foreground capitalize">
                        ({address.addressType === "otro" && address.otherDescription 
                          ? address.otherDescription 
                          : address.addressType})
                      </span>
                      {address.isMain && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Principal</span>
                      )}
                    </div>
                    <p className="text-sm text-card-foreground">
                      {address.street} #{address.number}, {address.neighborhood}
                    </p>
                    <p className="text-sm text-muted-foreground">CP: {address.postalCode}</p>
                    <p className="text-sm text-muted-foreground">Tel: {address.phone}</p>
                    {address.references && (
                      <p className="text-sm text-muted-foreground mt-1">Ref: {address.references}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!address.isMain && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSetMain(address.id)}
                        title="Establecer como principal"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={() => handleEdit(address)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(address.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-3">
            <Button onClick={handleUseLast} variant="outline" className="flex-1 bg-transparent">
              Usar Última Dirección
            </Button>
            <Button onClick={handleContinue} className="flex-1">
              Continuar con Dirección Principal
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Dirección" : "Nueva Dirección"}</CardTitle>
            <CardDescription>Completa los datos de tu dirección de entrega</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userName">Nombre del usuario *</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressType">Tipo de dirección *</Label>
                  <Select
                    value={formData.addressType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        addressType: value as Address["addressType"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="departamento">Departamento</SelectItem>
                      <SelectItem value="oficina">Oficina</SelectItem>
                      <SelectItem value="trabajo">Trabajo</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Textarea condicional para "Otro" */}
                {formData.addressType === "otro" && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="otherDescription">Especifica el tipo de dirección *</Label>
                    <Textarea
                      id="otherDescription"
                      value={formData.otherDescription || ""}
                      onChange={(e) => setFormData({ ...formData, otherDescription: e.target.value })}
                      placeholder="Ej: Consultorio, Taller, Negocio, etc."
                      rows={2}
                      maxLength={100}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.otherDescription?.length || 0}/100 caracteres
                    </p>
                  </div>
                )}

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="street">Calle *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Colonia *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal *</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{5}"
                    maxLength={5}
                    value={formData.postalCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      setFormData({ ...formData, postalCode: value })
                    }}
                    placeholder="12345"
                    required
                  />
                  <p className="text-xs text-muted-foreground">5 dígitos numéricos</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      setFormData({ ...formData, phone: value })
                    }}
                    placeholder="5512345678"
                    required
                  />
                  <p className="text-xs text-muted-foreground">10 dígitos sin espacios</p>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="references">Referencias del domicilio</Label>
                  <Textarea
                    id="references"
                    value={formData.references}
                    onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                    placeholder="Ej: Entre calle X y Y, casa de color azul"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    resetForm()
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingId ? "Actualizar" : "Guardar Dirección"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <Button 
            onClick={() => setShowForm(true)} 
            className="w-full" 
            size="lg"
            disabled={addresses.length >= 2}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Nueva Dirección
          </Button>
          {addresses.length >= 2 && (
            <p className="text-sm text-center text-muted-foreground">
              Has alcanzado el límite de 2 direcciones. Elimina una para agregar otra.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
