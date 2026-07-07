"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Edit, User, Phone, Home } from "lucide-react"

interface Address {
  id: string
  userName: string
  addressType: string
  otherDescription?: string
  street: string
  number: string
  neighborhood: string
  postalCode: string
  phone: string
  references: string
  isMain: boolean
}

export default function CuentaPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [address, setAddress] = useState<Address | null>(null)

  useEffect(() => {
    setMounted(true)
    const addresses = localStorage.getItem("deliveryAddresses")
    if (addresses) {
      const parsedAddresses: Address[] = JSON.parse(addresses)
      const mainAddress = parsedAddresses.find((addr) => addr.isMain) || parsedAddresses[0]
      setAddress(mainAddress)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Título */}
          <div className="flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Cuenta</h1>
              <p className="text-muted-foreground">Información de tu cuenta y dirección de entrega</p>
            </div>
          </div>

          {/* Dirección Principal */}
          {address ? (
            <Card className="border-l-4 border-l-primary shadow-lg">
              <CardHeader className="bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle>Dirección 1</CardTitle>
                  </div>
                  <Badge variant="default" className="bg-primary">
                    Principal
                  </Badge>
                </div>
                <CardDescription>Tu dirección de entrega predeterminada</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Datos del Usuario */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-semibold text-lg">{address.userName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-semibold text-lg">{address.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4" />

                {/* Dirección Completa */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Dirección Completa</p>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {address.street} #{address.number}
                        </p>
                        <p className="text-muted-foreground">
                          Colonia: {address.neighborhood}
                        </p>
                        <p className="text-muted-foreground">
                          CP: {address.postalCode}
                        </p>
                        <p className="text-muted-foreground capitalize">
                          Tipo: {address.addressType}
                        </p>
                        {address.references && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-md">
                            <p className="text-sm font-medium text-muted-foreground">Referencias:</p>
                            <p className="text-sm">{address.references}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón Editar */}
                <div className="pt-4">
                  <Button
                    onClick={() => router.push("/direccion")}
                    className="w-full"
                    size="lg"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Dirección
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Sin dirección guardada
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tienes dirección guardada</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Agrega tu dirección de entrega para poder realizar pedidos
                </p>
                <Button onClick={() => router.push("/direccion")} size="lg">
                  <MapPin className="h-4 w-4 mr-2" />
                  Agregar Dirección
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Información Adicional */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>💡 Nota:</strong> Esta es tu dirección principal. Puedes editarla en cualquier momento
              antes de realizar un pedido.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
