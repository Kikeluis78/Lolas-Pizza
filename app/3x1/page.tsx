"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { especialidades3x1 } from "@/config/menu.config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState } from "react"
import { Pizza3x1Modal } from "@/components/pizza-3x1-modal"

export default function Pizza3x1Page() {
  const router = useRouter()
  const [selectedPizza, setSelectedPizza] = useState<(typeof especialidades3x1)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePizzaClick = (pizza: typeof especialidades3x1[0]) => {
    setSelectedPizza(pizza)
    setIsModalOpen(true)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-2 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg">
              Especialidades 3x1
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-accent">⚡ ¡Tres pizzas al precio de una!</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-8">
            {especialidades3x1.map((especialidad, index) => (
              <Card
                key={especialidad.name}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-secondary/60 animate-fadeIn bg-gradient-to-br from-card via-secondary/5 to-accent/5 hover:border-secondary/100 hover:shadow-glow"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handlePizzaClick(especialidad)}
              >
                <CardHeader className="pb-3 pt-4 px-3 bg-gradient-to-r from-secondary/10 to-accent/10">
                  <CardTitle className="text-center text-lg sm:text-xl md:text-base font-extrabold text-secondary group-hover:text-secondary/80 transition-colors line-clamp-2">
                    {especialidad.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 pb-3 px-3">
                  <Button size="sm" className="w-full text-xs h-8 font-bold bg-gradient-to-r from-secondary via-accent to-primary text-white hover:from-secondary/90 hover:via-accent/90 hover:to-primary/90 shadow-md hover:shadow-glow hover:scale-105 transition-all duration-300">
                    Ver Opciones
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => router.push("/2x1")}
              variant="outline"
              size="lg"
              className="gap-2 font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Ver Promoción 2x1</span>
            </Button>
            <Button
              onClick={() => router.push("/pizzas")}
              size="lg"
              className="gap-2 gradient-primary shadow-lg hover:shadow-glow hover:scale-105 transition-all duration-300 font-extrabold"
            >
              <span>Volver a Pizzas</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />

      <Pizza3x1Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pizza={selectedPizza}
        allEspecialidades={especialidades3x1.map((e) => e.name)}
      />
    </>
  )
}
