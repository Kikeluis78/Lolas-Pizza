"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRequireAddress } from "@/hooks/use-require-address"
import Image from "next/image"
import Swal from "sweetalert2"
import { paquetes } from "@/config/menu.config"
import { PromoMesModal } from "@/components/promo-mes-modal"
import { pizzeriaConfig } from "@/config/pizzeria.config"
import { useEffect, useState } from "react"

export default function PaquetesPage() {
  const { addItem } = useCart()
  const { requireAddress } = useRequireAddress()
  const [isPromoOpen, setIsPromoOpen] = useState(false)
  const [promoActiva, setPromoActiva] = useState<typeof pizzeriaConfig.promoMes.promos[0] | null>(null)

  useEffect(() => {
    const { enabled, promos } = pizzeriaConfig.promoMes
    if (!enabled) return
    const now = new Date()
    const mmdd = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    const activa = promos.find(p => mmdd >= p.fechaInicio && mmdd <= p.fechaFin) ?? null
    if (!activa) return
    const hiddenDate = localStorage.getItem("promoMesHiddenDate")
    if (hiddenDate === now.toISOString().slice(0, 10)) return
    setPromoActiva(activa)
    setIsPromoOpen(true)
  }, [])

  const handleAddToCart = (pkg: (typeof paquetes)[0]) => {
    // Validar que el usuario tenga dirección antes de agregar al carrito
    if (!requireAddress()) {
      return
    }

    addItem({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      image: pkg.image,
      description: pkg.description,
    })

    Swal.fire({
      icon: "success",
      title: "Agregado al carrito",
      text: `${pkg.name} ha sido agregado al carrito`,
      timer: 2000,
      showConfirmButton: false,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-accent/5">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Package className="h-10 w-10 text-accent" />
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent drop-shadow-lg">
              Paquetes Especiales
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-medium">
            Disfruta de nuestros paquetes especiales con las mejores combinaciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paquetes.map((pkg) => (
            <Card key={pkg.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-accent/60 bg-gradient-to-br from-card via-accent/10 to-secondary/10 hover:border-accent/100 hover:shadow-glow">
              <div className="relative aspect-video bg-gradient-to-br from-accent/20 to-secondary/20">
                <Image src={pkg.image || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
              </div>
              <CardHeader className="bg-gradient-to-r from-accent/15 to-secondary/15">
                <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent group-hover:from-accent/80 group-hover:to-secondary/80 transition-all">
                  {pkg.name}
                </CardTitle>
                <CardDescription className="font-bold text-base text-accent/90">
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                    ${pkg.price}
                  </span>
                  <Button 
                    onClick={() => handleAddToCart(pkg)} 
                    className="gap-2 bg-gradient-to-r from-accent via-secondary to-primary text-white hover:from-accent/90 hover:via-secondary/90 hover:to-primary/90 shadow-md hover:shadow-glow hover:scale-110 transition-all duration-300 font-bold h-11"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />

      <PromoMesModal isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} promo={promoActiva} />
    </div>
  )
}
