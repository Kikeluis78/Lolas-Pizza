"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Wallet, Gift, Tag } from "lucide-react"
import { useEffect, useState } from "react"
import { RewardsSocialContent } from "@/components/rewards-social-content"
import { DailyTasksContent } from "@/components/daily-tasks-content"
import { SpinWheelContent } from "@/components/spin-wheel-content"
import { getMoneyBalance, getAvailablePizzas, getAvailableDiscounts } from "@/lib/spin-utils"

interface RewardsData {
  points: number
  completedOnce: string[]
  dailyTasks: {
    [key: string]: string
  }
}

export default function RecompensasPage() {
  const [mounted, setMounted] = useState(false)
  const [view, setView] = useState<"menu" | "social" | "daily" | "wheel" | "game">("menu")
  const [rewards, setRewards] = useState<RewardsData>({
    points: 0,
    completedOnce: [],
    dailyTasks: {},
  })
  const [moneyBalance, setMoneyBalance] = useState(0)
  const [availablePizzas, setAvailablePizzas] = useState(0)
  const [availableDiscounts, setAvailableDiscounts] = useState(0)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("rewardsData")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRewards({
          points: parsed.points ?? 0,
          completedOnce: parsed.completedOnce ?? [],
          dailyTasks: parsed.dailyTasks ?? {},
        })
      } catch {
        console.error("Error parsing rewardsData from localStorage")
      }
    }
    // Cargar datos de premios
    setMoneyBalance(getMoneyBalance())
    setAvailablePizzas(getAvailablePizzas().length)
    setAvailableDiscounts(getAvailableDiscounts().length)
  }, [])

  // Actualizar datos al volver al menú
  const refreshData = () => {
    // Pequeño delay para asegurar que localStorage se actualizó
    setTimeout(() => {
      setMoneyBalance(getMoneyBalance())
      setAvailablePizzas(getAvailablePizzas().length)
      setAvailableDiscounts(getAvailableDiscounts().length)
    }, 100)
  }

  // Escuchar cambios en localStorage desde otras pestañas/componentes
  useEffect(() => {
    const handleStorageChange = () => {
      setMoneyBalance(getMoneyBalance())
      setAvailablePizzas(getAvailablePizzas().length)
      setAvailableDiscounts(getAvailableDiscounts().length)
    }

    // Evento personalizado para actualizaciones dentro de la misma página
    window.addEventListener('rewardsUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('rewardsUpdated', handleStorageChange)
    }
  }, [])

  const saveRewards = (newRewards: RewardsData) => {
    setRewards(newRewards)
    localStorage.setItem("rewardsData", JSON.stringify(newRewards))
  }

  const handleTaskComplete = (platform: string, points: number, type: "social" | "daily") => {
    if (type === "social") {
      const newRewards = {
        ...rewards,
        points: rewards.points + points,
        completedOnce: [...rewards.completedOnce, platform],
      }
      saveRewards(newRewards)
    } else if (type === "daily") {
      const today = new Date().toDateString()
      const taskKey = `like-${platform}`
      const newRewards = {
        ...rewards,
        points: rewards.points + points,
        dailyTasks: {
          ...rewards.dailyTasks,
          [taskKey]: today,
        },
      }
      saveRewards(newRewards)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-0">
        {/* Gaming Header - Premios */}
        <div className="bg-gradient-to-r from-primary via-accent to-secondary border-b-4 border-primary/50 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Saldo Acumulado */}
              <div className="bg-black/20 backdrop-blur border-2 border-green-400/50 rounded-lg p-4 hover:border-green-400/100 transition-all">
                <p className="text-xs uppercase tracking-widest text-white/90 mb-1 font-bold flex items-center gap-1">
                  <Wallet className="h-3 w-3" /> Saldo
                </p>
                <div className="text-3xl font-black text-green-400 drop-shadow-lg">${moneyBalance.toFixed(2)}</div>
                <p className="text-xs text-white/70 mt-1">Acumulado en premios</p>
              </div>

              {/* Pizzas Ganadas */}
              <div className="bg-black/20 backdrop-blur border-2 border-orange-400/50 rounded-lg p-4 hover:border-orange-400/100 transition-all">
                <p className="text-xs uppercase tracking-widest text-white/90 mb-1 font-bold flex items-center gap-1">
                  <Gift className="h-3 w-3" /> Pizzas
                </p>
                <div className="text-3xl font-black text-orange-400 drop-shadow-lg">{availablePizzas}</div>
                <p className="text-xs text-white/70 mt-1">Disponibles para usar</p>
              </div>

              {/* Descuentos */}
              <div className="bg-black/20 backdrop-blur border-2 border-purple-400/50 rounded-lg p-4 hover:border-purple-400/100 transition-all">
                <p className="text-xs uppercase tracking-widest text-white/90 mb-1 font-bold flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Descuentos
                </p>
                <div className="text-3xl font-black text-purple-400 drop-shadow-lg">{availableDiscounts}</div>
                <p className="text-xs text-white/70 mt-1">Disponibles</p>
              </div>

              {/* Tareas Hoy */}
              <div className="bg-black/20 backdrop-blur border-2 border-accent/50 rounded-lg p-4 hover:border-accent/100 transition-all">
                <p className="text-xs uppercase tracking-widest text-white/90 mb-1 font-bold">Tareas Hoy</p>
                <div className="text-3xl font-black text-white drop-shadow-lg">
                  {Object.values(rewards.dailyTasks).filter(d => d === new Date().toDateString()).length}/4
                </div>
                <p className="text-xs text-white/70 mt-1">Completa todas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl pt-8">
          {view === "menu" ? (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Tarjeta Tragamonedas */}
              <Card 
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-yellow-400/60 bg-gradient-to-br from-card via-yellow-500/5 to-orange-500/5 hover:border-yellow-400/100 hover:shadow-glow group"
                onClick={() => setView("wheel")}
              >
                <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                  <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-orange-400 transition-all">
                    🎰 Tragamonedas
                  </CardTitle>
                  <CardDescription>Gira y gana dinero, pizzas y más</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-yellow-500 mb-2">$0.50 - $250</div>
                  <p className="text-sm text-muted-foreground">Premios en dinero acumulable</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Una vez por día</p>
                </CardContent>
              </Card>

              {/* Tarjeta Tareas Diarias */}
              <Card 
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-accent/60 bg-gradient-to-br from-card via-accent/5 to-secondary/5 hover:border-accent/100 hover:shadow-glow group"
                onClick={() => setView("daily")}
              >
                <CardHeader className="bg-gradient-to-r from-accent/10 to-secondary/10">
                  <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent group-hover:from-accent/80 group-hover:to-secondary/80 transition-all">
                    ⭐ Tareas Diarias
                  </CardTitle>
                  <CardDescription>Dale like y gana 100 puntos cada día</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-accent mb-2">+400</div>
                  <p className="text-sm text-muted-foreground">Máximo diario por tareas</p>
                </CardContent>
              </Card>

              {/* Tarjeta Redes Sociales */}
              <Card 
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-primary/60 bg-gradient-to-br from-card via-primary/5 to-accent/5 hover:border-primary/100 hover:shadow-glow group"
                onClick={() => setView("social")}
              >
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-accent/80 transition-all">
                    👥 Redes Sociales
                  </CardTitle>
                  <CardDescription>Sigue y gana 500 puntos (una sola vez)</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">+2000</div>
                  <p className="text-sm text-muted-foreground">Máximo por todas las redes</p>
                </CardContent>
              </Card>

              {/* Tarjeta Game - Próximamente */}
              <Card 
                className="cursor-not-allowed transition-all duration-300 border-4 border-muted/40 bg-muted/5 group opacity-60"
              >
                <CardHeader className="bg-gradient-to-r from-muted/10 to-muted/5">
                  <CardTitle className="text-2xl font-extrabold text-muted-foreground">
                    🎮 Mini Game
                  </CardTitle>
                  <CardDescription>Juega y gana puntos</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-muted-foreground mb-2">🕹️</div>
                  <p className="text-sm text-muted-foreground">Próximamente</p>
                </CardContent>
              </Card>
            </div>
          ) : view === "social" ? (
            <RewardsSocialContent 
              completedOnce={rewards.completedOnce}
              onBack={() => setView("menu")}
              onTaskComplete={(platform, points) => handleTaskComplete(platform, points, "social")}
            />
          ) : view === "daily" ? (
            <DailyTasksContent 
              dailyTasks={rewards.dailyTasks}
              onBack={() => setView("menu")}
              onTaskComplete={(platform, points) => handleTaskComplete(platform, points, "daily")}
            />
          ) : view === "wheel" ? (
            <SpinWheelContent onBack={() => { setView("menu"); refreshData(); }} />
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  )
}
