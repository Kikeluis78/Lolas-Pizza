"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Swal from "sweetalert2"
import { SlotMachine } from "@/components/slot-machine"
import { 
  Prize, 
  canSpin, 
  saveSpin, 
  saveLastWin, 
  getLastWin, 
  getRemainingTime, 
  formatTime,
  addMoneyToUser,
  addWonPizza,
  addWonDiscount,
  addWonGift,
  updateStreak,
  getStreakStatus
} from "@/lib/spin-utils"

interface SpinWheelContentProps {
  onBack: () => void
}

export function SpinWheelContent({ onBack }: SpinWheelContentProps) {
  const [canSpinNow, setCanSpinNow] = useState(true)
  const [remainingTime, setRemainingTime] = useState(0)
  const [lastWin, setLastWin] = useState<Prize | null>(null)
  const [streakStatus, setStreakStatus] = useState({ current: 0, remaining: 10, completed: false, lastDate: "" })

  // Verificar estado inicial
  useEffect(() => {
    const checkSpinStatus = () => {
      setCanSpinNow(canSpin())
      setRemainingTime(getRemainingTime())
      setLastWin(getLastWin())
      setStreakStatus(getStreakStatus())
    }

    checkSpinStatus()

    // Actualizar contador cada segundo
    const interval = setInterval(() => {
      const remaining = getRemainingTime()
      setRemainingTime(remaining)
      
      if (remaining === 0 && !canSpinNow) {
        setCanSpinNow(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [canSpinNow])

  // Manejar victoria
  const handleWin = (prize: Prize) => {
    // Actualizar racha
    const streakResult = updateStreak()
    setStreakStatus(getStreakStatus())

    // Si rompió la racha, mostrar alerta
    if (streakResult.broken) {
      Swal.fire({
        title: "¡Racha Perdida! 😢",
        html: `
          <p class="text-lg">No giraste ayer y perdiste todos tus premios.</p>
          <p class="text-sm text-gray-500 mt-2">¡Vuelve a empezar y llega a 10 días!</p>
        `,
        icon: "warning",
        confirmButtonText: "Entendido",
      })
    }

    // Guardar el giro
    saveSpin()
    saveLastWin(prize)
    setLastWin(prize)
    setCanSpinNow(false)
    setRemainingTime(getRemainingTime())

    // Procesar premio según tipo
    if (prize.type === "money") {
      const newBalance = addMoneyToUser(prize.value as number)
      Swal.fire({
        title: "¡GANASTE! 💰",
        html: `
          <div class="text-5xl mb-4">${prize.icon}</div>
          <p class="text-3xl font-bold text-green-500">${prize.label}</p>
          <p class="text-sm text-gray-500 mt-2">Se sumó a tu saldo</p>
          <p class="text-lg font-semibold mt-2">Saldo total: $${newBalance.toFixed(2)}</p>
          <p class="text-xs text-gray-400 mt-1">No canjeable por efectivo</p>
        `,
        icon: "success",
        confirmButtonText: "¡Genial!",
      })
    } else if (prize.type === "discount") {
      addWonDiscount(prize.value as number)
      Swal.fire({
        title: "¡DESCUENTO! 🏷️",
        html: `
          <div class="text-5xl mb-4">${prize.icon}</div>
          <p class="text-3xl font-bold text-purple-500">${prize.label}</p>
          <p class="text-sm text-gray-500 mt-2">Válido para tu próxima compra</p>
        `,
        icon: "success",
        confirmButtonText: "¡Gracias!",
      })
    } else if (prize.type === "pizza") {
      addWonPizza(prize.value as string)
      Swal.fire({
        title: "¡PIZZA GRATIS! 🍕",
        html: `
          <div class="text-5xl mb-4">🍕</div>
          <p class="text-2xl font-bold text-orange-500">${prize.label} Gratis</p>
          <p class="text-sm text-gray-600 mt-2 font-semibold">Especialidad de 1 ingrediente</p>
          <p class="text-xs text-gray-400 mt-1">No canjeable por efectivo</p>
        `,
        icon: "success",
        confirmButtonText: "¡Delicioso!",
      })
    } else if (prize.type === "gift") {
      addWonGift()
      Swal.fire({
        title: "¡PREMIO SORPRESA! 🎁",
        html: `
          <div class="text-5xl mb-4">🎁</div>
          <p class="text-2xl font-bold text-pink-500">${prize.label}</p>
          <p class="text-sm text-gray-500 mt-2">¡Descúbrelo en tu próximo pedido!</p>
        `,
        icon: "success",
        confirmButtonText: "¡Qué emoción!",
      })
    }
  }

  return (
    <>
      <Button variant="outline" className="mb-6 w-full" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>

      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            🎰 Giro de la Suerte
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            {canSpinNow 
              ? "¡Gira y gana increíbles premios!" 
              : `Próximo giro disponible en: ${formatTime(remainingTime)}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 pb-8">
          {/* Último premio ganado */}
          {lastWin && (
            <div className="text-center mb-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">
                Último Premio
              </p>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-lg border border-cyan-300/30">
                <span className="text-4xl">{lastWin.icon}</span>
                <span className="font-bold text-lg">{lastWin.label}</span>
              </div>
            </div>
          )}

          {/* Tragamonedas */}
          <SlotMachine 
            onWin={handleWin} 
            disabled={!canSpinNow}
          />

          {/* Lista de premios */}
          <div className="w-full max-w-sm mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-bold text-center">
              🎁 Obten Premios Cada 24 Horas
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1 text-green-400">
                <span>💵</span> $0.50
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <span>💵</span> $1.00
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <span>💵</span> $2.00
              </div>
              <div className="flex items-center gap-1 text-emerald-500">
                <span>💰</span> $5.00
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <span>💰</span> $10.00
              </div>
              <div className="flex items-center gap-1 text-cyan-500">
                <span>💎</span> $15.00
              </div>
              <div className="flex items-center gap-1 text-cyan-600">
                <span>💎</span> $30.00
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <span>👑</span> $100.00
              </div>
              <div className="flex items-center gap-1 text-purple-500">
                <span>🏷️</span> 50%
              </div>
              <div className="flex items-center gap-1 text-orange-500">
                <span>🍕</span> Pizza
              </div>
              <div className="flex items-center gap-1 text-pink-500">
                <span>🎁</span> Sorpresa
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground/70 mt-3 text-center">
              * El dinero se acumula. No canjeable por efectivo.
            </p>
          </div>

          {/* Sistema de Racha */}
          <div className="w-full max-w-sm mt-2 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-2 font-bold text-center flex items-center justify-center gap-1">
              🔥 Sistema de Racha
            </p>
            <p className="text-xs text-center text-muted-foreground">
              Gira <span className="font-bold text-orange-400">10 días seguidos</span> para mantener tus premios
            </p>
            <p className="text-[10px] text-center text-red-400 mt-1">
              ⚠️ Si pierdes un día, pierdes todo y empiezas de 0
            </p>
          </div>
        
        </CardContent>
      </Card>
    </>
  )
}


