"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useRequireAddress } from "@/hooks/use-require-address"
import Swal from "sweetalert2"
import { ShoppingCart } from "lucide-react"

interface ComplementoCardProps {
  complemento: {
    id: string
    name: string
    price: number
    description: string
  }
}

export function ComplementoCard({ complemento }: ComplementoCardProps) {
  const { addItem } = useCart()
  const { requireAddress } = useRequireAddress()

  const handleAddToCart = () => {
    // Validar que el usuario tenga dirección antes de agregar al carrito
    if (!requireAddress()) {
      return
    }

    addItem({
      id: complemento.id,
      name: complemento.name,
      description: complemento.description,
      price: complemento.price,
      image: "/placeholder.svg?height=100&width=100",
    })

    Swal.fire({
      icon: "success",
      title: "Agregado al carrito",
      text: `${complemento.name} ha sido agregado`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    })
  }

  return (
    <Card className="group flex flex-col hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-secondary/60 bg-gradient-to-br from-card via-secondary/10 to-accent/10 hover:border-secondary/100 hover:shadow-glow">
      <CardHeader className="bg-gradient-to-r from-secondary/20 via-accent/10 to-primary/10 pb-4">
        <CardTitle className="text-2xl font-extrabold text-secondary group-hover:text-secondary/80 transition-colors">
          {complemento.name}
        </CardTitle>
        {complemento.description && (
          <p className="text-sm text-muted-foreground mt-2">{complemento.description}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-4" />

      <CardFooter className="flex flex-col gap-3 bg-gradient-to-t from-secondary/5 to-transparent">
        <div className="text-3xl font-bold text-secondary text-center w-full">
          ${complemento.price}
        </div>
        <Button 
          onClick={handleAddToCart} 
          className="w-full h-12 font-bold bg-gradient-to-r from-secondary via-accent to-primary text-white hover:from-secondary/90 hover:via-accent/90 hover:to-primary/90 shadow-md hover:shadow-glow transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
