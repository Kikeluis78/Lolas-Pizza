"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/hooks/use-cart"
import { useRequireAddress } from "@/hooks/use-require-address"
import Swal from "sweetalert2"
import { Plus } from "lucide-react"

interface Pizza2x1CardProps {
  especialidad: {
    name: string
    ingredients: string
    prices: { CH: number; MED: number; GDE: number; FAM: number }
  }
  allEspecialidades: string[]
}

// Función para calcular precio de orilla
const getEdgeCheesePrice = (size: "CH" | "MED" | "GDE" | "FAM"): number => {
  const prices = { CH: 30, MED: 40, GDE: 50, FAM: 60 }
  return prices[size]
}

// Type guard para CheckedState
const getCheckedValue = (checked: string | boolean): boolean => {
  if (typeof checked === "boolean") return checked
  if (checked === "indeterminate") return false
  return Boolean(checked)
}

export function Pizza2x1Card({ especialidad, allEspecialidades }: Pizza2x1CardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { requireAddress } = useRequireAddress()
  const [size, setSize] = useState<"CH" | "MED" | "GDE" | "FAM">("MED")

  // Primera pizza
  const [pizza1Type, setPizza1Type] = useState<"completa" | "mitad-y-mitad">("completa")
  const [pizza1Mitad2, setPizza1Mitad2] = useState("")
  const [pizza1EdgeCheese, setPizza1EdgeCheese] = useState(false)

  // Segunda pizza
  const [pizza2Type, setPizza2Type] = useState<"completa" | "mitad-y-mitad">("completa")
  const [pizza2Name, setPizza2Name] = useState("")
  const [pizza2Mitad2, setPizza2Mitad2] = useState("")
  const [pizza2EdgeCheese, setPizza2EdgeCheese] = useState(false)

  // Complementos
  const [selectedComplementos, setSelectedComplementos] = useState<string[]>([])

  const [anotaciones, setAnotaciones] = useState("")

  const isPizzaType = (val: string): val is "completa" | "mitad-y-mitad" => val === "completa" || val === "mitad-y-mitad"

  const price = especialidad.prices[size]
  const mitadYMitadExtra = 25
  const extraTotal = (pizza1Type === "mitad-y-mitad" ? mitadYMitadExtra : 0) + (pizza2Type === "mitad-y-mitad" ? mitadYMitadExtra : 0)
  const edgeCheeseExtra = (pizza1EdgeCheese ? getEdgeCheesePrice(size) : 0) + (pizza2EdgeCheese ? getEdgeCheesePrice(size) : 0)
  const finalPrice = price + extraTotal + edgeCheeseExtra

  const handleAddToCart = () => {
    // Validar que el usuario tenga dirección antes de agregar al carrito
    if (!requireAddress()) {
      return
    }

    if (pizza1Type === "mitad-y-mitad" && !pizza1Mitad2) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Selecciona la segunda mitad de la primera pizza",
      })
      return
    }

    if (!pizza2Name) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Selecciona la segunda pizza del 2x1",
      })
      return
    }

    if (pizza2Type === "mitad-y-mitad" && !pizza2Mitad2) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Selecciona la segunda mitad de la segunda pizza",
      })
      return
    }

    // Build description
    let description = `PROMOCIÓN 2X1 - Tamaño: ${size}\n\n`
    if (extraTotal > 0 || edgeCheeseExtra > 0) {
      description += `💡 Extras:\n`
      if (extraTotal > 0) {
        description += `  • Mitad y mitad: +$${extraTotal}\n`
      }
      if (edgeCheeseExtra > 0) {
        description += `  • Orilla de Queso: +$${edgeCheeseExtra}\n`
      }
    }

    description += `\n🔴 Primera Pizza: ${especialidad.name}\n`
    if (pizza1Type === "mitad-y-mitad") {
      description += `  Mitad y Mitad:\n`
      description += `  • ${especialidad.name}\n`
      description += `  • ${pizza1Mitad2}\n`
    } else {
      description += `  (Pizza completa)\n`
    }
    if (pizza1EdgeCheese) {
      description += `  🧀 Orilla de Queso: +$${getEdgeCheesePrice(size)}\n`
    }

    description += `\n🔴 Segunda Pizza: ${pizza2Name}\n`
    if (pizza2Type === "mitad-y-mitad") {
      description += `  Mitad y Mitad:\n`
      description += `  • ${pizza2Name}\n`
      description += `  • ${pizza2Mitad2}\n`
    } else {
      description += `  (Pizza completa)\n`
    }
    if (pizza2EdgeCheese) {
      description += `  🧀 Orilla de Queso: +$${getEdgeCheesePrice(size)}\n`
    }

    if (anotaciones.trim()) {
      description += `\n📝 Anotaciones: ${anotaciones}`
    }

    if (selectedComplementos.length > 0) {
      description += `\n\n🥤 Complementos: ${selectedComplementos.join(", ")}`
    }

    const itemId = `2x1-${especialidad.name}-${pizza2Name}-${size}-${Date.now()}`

    // Generar ID determinista para agrupación
    const cleanId = (str: string) => str.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const p1Part = pizza1Type === "mitad-y-mitad" ? `${cleanId(especialidad.name)}-${cleanId(pizza1Mitad2)}` : cleanId(especialidad.name)
    const p1EdgePart = pizza1EdgeCheese ? `-edge1` : ''
    const p2Part = pizza2Type === "mitad-y-mitad" ? `${cleanId(pizza2Name)}-${cleanId(pizza2Mitad2)}` : cleanId(pizza2Name)
    const p2EdgePart = pizza2EdgeCheese ? `-edge2` : ''
    const notesPart = anotaciones.trim() ? `-${cleanId(anotaciones)}` : ''
    
    const deterministicId = `2x1-${size}-${p1Part}${p1EdgePart}-${p2Part}${p2EdgePart}${notesPart}`

    addItem({
      id: deterministicId,
      name: `2x1: ${especialidad.name} + ${pizza2Name}`,
      description,
      price: finalPrice,
      image: "/delicious-pizza.png",
    })

    // Add complementos as separate items
    selectedComplementos.forEach((comp) => {
      if (comp.includes("Refresco 2L")) {
        addItem({
          id: `comp-refresco-2lt-${Date.now()}`,
          name: "Refresco de Sabor 2 Lts",
          description: "",
          price: 45,
          image: "/placeholder.svg?height=100&width=100",
        })
      } else if (comp.includes("Coca Cola")) {
        addItem({
          id: `comp-coca-${Date.now()}`,
          name: "Coca Cola 2 Lts",
          description: "",
          price: 49,
          image: "/placeholder.svg?height=100&width=100",
        })
      } else if (comp.includes("Lata")) {
        addItem({
          id: `comp-lata-${Date.now()}`,
          name: "Refresco de Lata",
          description: "",
          price: 28,
          image: "/placeholder.svg?height=100&width=100",
        })
      }
    })

    Swal.fire({
      icon: "success",
      title: "Agregado al carrito",
      text: `Tu promoción 2x1 ha sido agregada`,
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      router.push("/pizzas")
    })

    // Reset form
    setPizza1Type("completa")
    setPizza1Mitad2("")
    setPizza2Type("completa")
    setPizza2Name("")
    setPizza2Mitad2("")
    setSelectedComplementos([])
    setAnotaciones("")
  }

  const toggleComplemento = (comp: string) => {
    setSelectedComplementos((prev) => (prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]))
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{especialidad.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{especialidad.ingredients}</p>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-2 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="pt-6 space-y-6">
        {/* Size selector */}
        <div className="space-y-2">
          <Label className="text-[50px] font-semibold">Tamaño</Label>
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
                <span className="text-xs">${especialidad.prices[s]}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t pt-3">
          <Label className="text-base font-semibold text-green-500">Primera Pizza: {especialidad.name}</Label>

          <RadioGroup
            value={pizza1Type}
            onValueChange={(v) => {
              if (isPizzaType(v)) setPizza1Type(v)
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completa" id={`p1-completa-${especialidad.name}`} />
              <Label htmlFor={`p1-completa-${especialidad.name}`}>Pizza completa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mitad-y-mitad" id={`p1-mitad-${especialidad.name}`} />
              <Label htmlFor={`p1-mitad-${especialidad.name}`}>Mitad y mitad</Label>
            </div>
          </RadioGroup>

          {pizza1Type === "mitad-y-mitad" && (
            <Accordion type="single" collapsible>
              <AccordionItem value="mitades">
                <AccordionTrigger>Seleccionar segunda mitad</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="mb-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                    Primera mitad: <strong>{especialidad.name}</strong>
                  </div>
                  <div>
                    <Label className="text-xs">Segunda mitad</Label>
                    <Select value={pizza1Mitad2} onValueChange={setPizza1Mitad2}>
                      <SelectTrigger>
                        <SelectValue placeholder="Elegir especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {allEspecialidades.map((esp) => (
                          <SelectItem key={esp} value={esp}>
                            {esp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
            <Checkbox 
              id="pizza1-edge-cheese" 
              checked={pizza1EdgeCheese}
              onCheckedChange={(checked) => setPizza1EdgeCheese(getCheckedValue(checked))}
            />
            <Label htmlFor="pizza1-edge-cheese" className="cursor-pointer font-semibold">
              🧀 Orilla de Queso +${getEdgeCheesePrice(size)}
            </Label>
          </div>
        </div>

        {/* Segunda Pizza */}
        <div className="space-y-3 border-t pt-3">
          <Label className="text-base font-semibold text-green-500">Segunda Pizza (2x1)</Label>

          <div>
            <Label className="text-xs">Especialidad</Label>
            <Select value={pizza2Name} onValueChange={setPizza2Name}>
              <SelectTrigger>
                <SelectValue placeholder="Elegir especialidad" />
              </SelectTrigger>
              <SelectContent>
                {allEspecialidades.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <RadioGroup
            value={pizza2Type}
            onValueChange={(v) => {
              if (isPizzaType(v)) setPizza2Type(v)
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completa" id={`p2-completa-${especialidad.name}`} />
              <Label htmlFor={`p2-completa-${especialidad.name}`}>Pizza completa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mitad-y-mitad" id={`p2-mitad-${especialidad.name}`} />
              <Label htmlFor={`p2-mitad-${especialidad.name}`}>Mitad y mitad</Label>
            </div>
          </RadioGroup>

          {pizza2Type === "mitad-y-mitad" && pizza2Name && (
            <Accordion type="single" collapsible>
              <AccordionItem value="mitades2">
                <AccordionTrigger>Seleccionar segunda mitad</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="mb-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                    Primera mitad: <strong>{pizza2Name}</strong>
                  </div>
                  <div>
                    <Label className="text-xs">Segunda mitad</Label>
                    <Select value={pizza2Mitad2} onValueChange={setPizza2Mitad2}>
                      <SelectTrigger>
                        <SelectValue placeholder="Elegir especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {allEspecialidades.map((esp) => (
                          <SelectItem key={esp} value={esp}>
                            {esp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
            <Checkbox 
              id="pizza2-edge-cheese" 
              checked={pizza2EdgeCheese}
              onCheckedChange={(checked) => setPizza2EdgeCheese(getCheckedValue(checked))}
            />
            <Label htmlFor="pizza2-edge-cheese" className="cursor-pointer font-semibold">
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

        {/* Resumen */}
        <div className="border-t pt-4 space-y-3">
          <div className="space-y-1 text-center bg-primary/5 p-4 rounded-lg">
            {extraTotal > 0 && (
              <p className="text-xs font-semibold text-primary">
                Extras: +${extraTotal}
              </p>
            )}
            <p className="text-3xl font-bold text-primary">${finalPrice}</p>
            <p className="text-xs text-muted-foreground">Promoción 2x1</p>
          </div>
          <Button 
            onClick={handleAddToCart} 
            className="w-full h-12 text-lg font-bold gradient-primary shadow-md hover:shadow-glow transition-all duration-200 hover:scale-105"
          >
            Agregar al Carrito
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
