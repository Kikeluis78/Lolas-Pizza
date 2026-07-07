"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Home, Store } from "lucide-react"
import { useRouter } from "next/navigation"

export function ServiceSelector() {
  const [serviceType, setServiceType] = useState<"delivery" | "restaurant" | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (serviceType === "delivery") {
      localStorage.setItem("serviceType", "delivery")
      router.push("/direccion")
    } else if (serviceType === "restaurant") {
      localStorage.setItem("serviceType", "restaurant")
      localStorage.removeItem("selectedAddress")
      // Redirigir directamente a pizzas sin modal
      router.push("/pizzas")
    }
  }

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl hover:shadow-glow-lg transition-all duration-300">
      <CardHeader className="bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 pb-6">
        <CardTitle className="text-3xl font-extrabold bg-linear-to-r from-primary to-destructive bg-clip-text text-transparent text-center">
          Selecciona tu servicio
        </CardTitle>
        <CardDescription className="text-base font-medium"></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <RadioGroup
          value={serviceType || ""}
          onValueChange={(value) => setServiceType(value as "delivery" | "restaurant")}
        >
          <div
            className={`group relative flex items-center space-x-4 space-y-0 rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 overflow-hidden ${serviceType === "delivery"
                ? "border-primary bg-linear-to-br from-primary/10 to-destructive/10 shadow-lg scale-[1.02]"
                : "border-border hover:border-primary/50 hover:shadow-md hover:scale-[1.01]"
              }`}
            onClick={() => setServiceType("delivery")}
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <RadioGroupItem value="delivery" id="delivery" className="z-10" />
            <Label htmlFor="delivery" className="flex items-center gap-4 cursor-pointer flex-1 font-normal z-10">
              <div className={`flex items-center justify-center h-16 w-16 rounded-2xl transition-all duration-300 ${serviceType === "delivery"
                  ? "bg-linear-to-br from-primary to-destructive shadow-lg shadow-primary/50"
                  : "bg-linear-to-br from-primary/20 to-destructive/20 group-hover:from-primary/30 group-hover:to-destructive/30"
                }`}>
                <Home className={`h-8 w-8 transition-colors duration-300 ${serviceType === "delivery" ? "text-white" : "text-primary"
                  }`} />
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-xl text-foreground mb-1">Servicio a Domicilio</p>
             
              </div>
            </Label>
          </div>

          <div
            className={`group relative flex items-center space-x-4 space-y-0 rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 overflow-hidden ${serviceType === "restaurant"
                ? "border-secondary bg-linear-to-br from-secondary/10 to-accent/10 shadow-lg scale-[1.02]"
                : "border-border hover:border-secondary/50 hover:shadow-md hover:scale-[1.01]"
              }`}
            onClick={() => setServiceType("restaurant")}
          >
            <div className="absolute inset-0 bg-linear-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <RadioGroupItem value="restaurant" id="restaurant" className="z-10" />
            <Label htmlFor="restaurant" className="flex items-center gap-4 cursor-pointer flex-1 font-normal z-10">
              <div className={`flex items-center justify-center h-16 w-16 rounded-2xl transition-all duration-300 ${serviceType === "restaurant"
                  ? "bg-linear-to-br from-secondary to-accent shadow-lg shadow-secondary/50"
                  : "bg-linear-to-br from-secondary/20 to-accent/20 group-hover:from-secondary/30 group-hover:to-accent/30"
                }`}>
                <Store className={`h-8 w-8 transition-colors duration-300 ${serviceType === "restaurant" ? "text-white" : "text-secondary"
                  }`} />
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-xl text-foreground mb-1">Recoger en Restaurante</p>
             
              </div>
            </Label>
          </div>
        </RadioGroup>

        <Button
          onClick={handleContinue}
          disabled={!serviceType}
          className="w-full mt-6 h-14 text-lg font-extrabold bglinear-to-r from-primary via-destructive to-secondary hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          size="lg"
        >
          Continuar con mi pedido 🚀
        </Button>
      </CardContent>
    </Card>
  )
}
