"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShoppingCartView } from "@/components/shopping-cart-view"
import { PaymentMethods } from "@/components/payment-methods"
import { OrderSteps } from "@/components/order-steps"
import { RestaurantContactForm } from "@/components/restaurant-contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export default function CarritoPage() {
  const [serviceType, setServiceType] = useState<string | null>(null)
  const [address, setAddress] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const type = localStorage.getItem("serviceType")
    setServiceType(type)

    if (type === "delivery") {
      const addresses = localStorage.getItem("deliveryAddresses")
      if (addresses) {
        const parsedAddresses = JSON.parse(addresses)
        const mainAddress = parsedAddresses.find((addr: any) => addr.isMain) || parsedAddresses[0]
        setAddress(mainAddress)
      }
    }
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 py-8">
        <div className="container mx-auto px-4">
          <OrderSteps current="/carrito" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            🛒 Carrito de Compras
          </h1>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Formulario de contacto PRIMERO para restaurant */}
              {mounted && serviceType === "restaurant" && (
                <RestaurantContactForm />
              )}

              {/* Dirección para delivery */}
              {mounted && serviceType === "delivery" && address && (
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      Dirección de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="font-bold">{address.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.street} #{address.number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.neighborhood}, CP {address.postalCode}
                      </p>
                      <p className="text-sm text-muted-foreground">Tel: {address.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <ShoppingCartView />
            </div>
            <div>
              <PaymentMethods />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
