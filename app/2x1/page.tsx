"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { especialidades2x1 } from "@/config/menu.config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState } from "react"
import { Pizza2x1Modal } from "@/components/pizza-2x1-modal"

export default function Pizza2x1Page() {
  const router = useRouter()
  const [selectedPizza, setSelectedPizza] = useState<(typeof especialidades2x1)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePizzaClick = (pizza: typeof especialidades2x1[0]) => {
    setSelectedPizza(pizza)
    setIsModalOpen(true)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-r from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-2 bg-linear-to-r from-primary via-destructive to-secondary bg-clip-text text-transparent drop-shadow-lg">
              Especialidades 2x1
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-secondary">🔥 Dos pizzas al precio de una</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-8">
            {especialidades2x1.map((especialidad, index) => (
              <Card
                key={especialidad.name}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary animate-fadeIn bg-linear-to-rr from-card to-primary/5"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handlePizzaClick(especialidad)}
              >
                <CardHeader className="pb-2 pt-4 px-3">
                  <CardTitle className="text-center text-sm font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {especialidad.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 pb-3 px-3">
                  <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-2 min-h-10">
                    {especialidad.ingredients}
                  </p>
                  <Button size="sm" className="w-full text-xs h-8 font-bold gradient-primary shadow-md hover:shadow-glow hover:scale-105 transition-all duration-300">
                    Seleccionar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => router.push("/pizzas")}
              variant="outline"
              size="lg"
              className="gap-2 font-bold border-2 hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a Pizzas</span>
            </Button>
            <Button
              onClick={() => router.push("/3x1")}
              size="lg"
              className="gap-2 gradient-secondary shadow-lg hover:shadow-glow hover:scale-105 transition-all duration-300 font-extrabold"
            >
              <span>⚡ Ver Promoción 3x1</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />

      <Pizza2x1Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pizza={selectedPizza}
        allEspecialidades={especialidades2x1.map((e) => e.name)}
      />
    </>
  )
}
