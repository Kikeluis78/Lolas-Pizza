"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/hooks/use-cart"
import { useRequireAddress } from "@/hooks/use-require-address"
import Swal from "sweetalert2"

interface PizzaUnIngredienteCardProps {
  pizza: {
    name: string
    ingredients: string
    prices: { CH: number; MED: number; GDE: number; FAM: number }
  }
}

const getEdgeCheesePrice = (size: "CH" | "MED" | "GDE" | "FAM"): number => {
  const prices = { CH: 30, MED: 40, GDE: 50, FAM: 60 }
  return prices[size]
}

const getCheckedValue = (checked: string | boolean): boolean => {
  if (typeof checked === "boolean") return checked
  if (checked === "indeterminate") return false
  return Boolean(checked)
}

export function PizzaUnIngredienteCard({ pizza }: PizzaUnIngredienteCardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { requireAddress } = useRequireAddress()
  const [size, setSize] = useState<"CH" | "MED" | "GDE" | "FAM">("MED")
  const [edgeCheese, setEdgeCheese] = useState(false)
  const [anotaciones, setAnotaciones] = useState("")

  const price = pizza.prices[size]
  const edgeCheeseExtra = edgeCheese ? getEdgeCheesePrice(size) : 0
  const finalPrice = price + edgeCheeseExtra

  const handleAddToCart = () => {
    if (!requireAddress()) {
      return
    }

    let description = `UN INGREDIENTE - Tamaño: ${size}\n\n`
    description += `🍕 ${pizza.name}\n`
    
    if (edgeCheeseExtra > 0) {
      description += `🧀 Orilla de Queso: +$${edgeCheeseExtra}\n`
    }

    if (anotaciones.trim()) {
      description += `\n📝 Anotaciones: ${anotaciones}`
    }

    const cleanId = (str: string) => str.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const edgePart = edgeCheese ? `-edge` : ''
    const notesPart = anotaciones.trim() ? `-${cleanId(anotaciones)}` : ''
    
    const deterministicId = `un-ingrediente-${size}-${cleanId(pizza.name)}${edgePart}${notesPart}`

    addItem({
      id: deterministicId,
      name: `Un Ingrediente: ${pizza.name}`,
      description,
      price: finalPrice,
      image: "/delicious-pizza.png",
    })

    Swal.fire({
      icon: "success",
      title: "Agregado al carrito",
      text: `Tu pizza de ${pizza.name} ha sido agregada`,
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      router.push("/pizzas")
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 bg-gradient-to-br from-card to-amber-500/5">
        <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{pizza.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{pizza.ingredients}</p>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-2 bg-gradient-to-br from-card to-amber-500/5">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Tamaño</Label>
            <div className="grid grid-cols-4 gap-2">
              {(["CH", "MED", "GDE", "FAM"] as const).map((s) => (
                <Button
                  key={s}
                  variant={size === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSize(s)}
                  className="flex flex-col h-auto py-2 transition-all duration-200 hover:scale-105"
                >
                  <span className="font-bold">{s}</span>
                  <span className="text-xs">${pizza.prices[s]}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
              <Checkbox 
                id="edge-cheese" 
                checked={edgeCheese}
                onCheckedChange={(checked) => setEdgeCheese(getCheckedValue(checked))}
              />
              <Label htmlFor="edge-cheese" className="cursor-pointer font-semibold">
                🧀 Orilla de Queso +${getEdgeCheesePrice(size)}
              </Label>
            </div>
          </div>

          <div className="space-y-3 border-t pt-3">
            <Label className="text-base font-semibold">Anotaciones Especiales</Label>
            <Textarea
              placeholder="Agrega o quita ingredientes. Ejemplo: Sin cebolla, extra queso, etc."
              value={anotaciones}
              onChange={(e) => setAnotaciones(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">{anotaciones.length}/200</p>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="space-y-1 text-center bg-amber-500/5 p-4 rounded-lg">
              {edgeCheeseExtra > 0 && (
                <p className="text-xs font-semibold text-amber-600">
                  Extras: +${edgeCheeseExtra}
                </p>
              )}
              <p className="text-3xl font-bold text-amber-600">${finalPrice}</p>
              <p className="text-xs text-muted-foreground">Un Ingrediente</p>
            </div>
            <Button 
              onClick={handleAddToCart} 
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-secondary text-white hover:from-amber-500/90 hover:via-orange-500/90 hover:to-secondary/90 shadow-md hover:shadow-glow transition-all duration-200 hover:scale-105"
            >
              Agregar al Carrito
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
