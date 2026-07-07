"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Prize, buildSpinSequence, getRandomPrize, prizes } from "@/lib/spin-utils"

interface SlotMachineProps {
  onWin: (prize: Prize) => void
  disabled: boolean
}

export function SlotMachine({ onWin, disabled }: SlotMachineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  
  const [isSpinning, setIsSpinning] = useState(false)
  const [displayItems, setDisplayItems] = useState<Prize[]>(() => 
    Array(3).fill(null).map(() => prizes[Math.floor(Math.random() * prizes.length)])
  )
  const [glowIntensity, setGlowIntensity] = useState(0)

  const startSpin = useCallback(() => {
    if (isSpinning || disabled) return

    setIsSpinning(true)
    setGlowIntensity(0)

    // Determinar el ganador
    const winner = getRandomPrize()
    const sequence = buildSpinSequence(winner, 40)

    // Estado de animación
    let currentIndex = 0
    let speed = 50 // ms entre items (empieza rápido)
    let lastTime = performance.now()
    let phase: "accelerate" | "constant" | "decelerate" = "accelerate"
    let bounceCount = 0
    const itemHeight = 80 // altura de cada item

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastTime

      // Actualizar items visibles basado en la velocidad
      if (elapsed >= speed) {
        lastTime = currentTime

        // Calcular los 3 items visibles
        if (currentIndex < sequence.length) {
          const centerItem = sequence[currentIndex]
          const topItem = sequence[currentIndex - 1] || prizes[0]
          const bottomItem = sequence[currentIndex + 1] || winner

          setDisplayItems([topItem, centerItem, bottomItem])
          currentIndex++

          // Efecto de brillo durante el giro
          setGlowIntensity(0.3 + Math.random() * 0.3)
        }

        // Aceleración inicial
        if (phase === "accelerate" && speed > 20) {
          speed = Math.max(20, speed - 3)
        }
        // Constante
        else if (phase === "accelerate" && speed <= 20) {
          phase = "constant"
        }
        // Desaceleración cuando faltan 15 items
        if (currentIndex > sequence.length - 15) {
          phase = "decelerate"
          speed = Math.min(200, speed + 8)
        }
      }

      // Continuar animación o detenerse
      if (currentIndex < sequence.length) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animación completada - efecto de rebote
        bounceCount++
        
        if (bounceCount <= 3) {
          // Rebote final
          setGlowIntensity(1)
          setTimeout(() => {
            setGlowIntensity(0.8)
            if (bounceCount < 3) {
              animationRef.current = requestAnimationFrame(animate)
            } else {
              // Fin definitivo
              setIsSpinning(false)
              setGlowIntensity(1)
              setDisplayItems([winner, winner, winner])
              onWin(winner)
            }
          }, 100)
        }
      }
    }

    // Iniciar animación
    animationRef.current = requestAnimationFrame(animate)
  }, [isSpinning, disabled, onWin])

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Máquina Tragamonedas */}
      <div 
        ref={containerRef}
        className="relative w-48 h-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-4 border-yellow-400 overflow-hidden shadow-2xl"
        style={{
          boxShadow: glowIntensity > 0 
            ? `0 0 ${30 * glowIntensity}px rgba(234, 179, 8, ${glowIntensity}), inset 0 0 ${20 * glowIntensity}px rgba(234, 179, 8, ${glowIntensity * 0.3})`
            : undefined,
          transition: "box-shadow 0.1s ease-out"
        }}
      >
        {/* Marco decorativo superior */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-yellow-500 to-yellow-600 flex items-center justify-center">
          <span className="text-xl">🎰</span>
        </div>

        {/* Ventana de visualización */}
        <div className="absolute inset-0 top-8 bottom-8 flex flex-col items-center justify-center overflow-hidden">
          {/* Luces laterales animadas */}
          <div className="absolute left-1 top-0 bottom-0 w-2 flex flex-col justify-around">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-100"
                style={{
                  backgroundColor: isSpinning 
                    ? ["#ef4444", "#eab308", "#22c55e", "#3b82f6"][i % 4]
                    : "#374151",
                  boxShadow: isSpinning 
                    ? `0 0 8px ${["#ef4444", "#eab308", "#22c55e", "#3b82f6"][i % 4]}`
                    : "none"
                }}
              />
            ))}
          </div>
          <div className="absolute right-1 top-0 bottom-0 w-2 flex flex-col justify-around">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-100"
                style={{
                  backgroundColor: isSpinning 
                    ? ["#22c55e", "#3b82f6", "#ef4444", "#eab308"][i % 4]
                    : "#374151",
                  boxShadow: isSpinning 
                    ? `0 0 8px ${["#22c55e", "#3b82f6", "#ef4444", "#eab308"][i % 4]}`
                    : "none"
                }}
              />
            ))}
          </div>

          {/* Items visibles */}
          <div className="flex flex-col items-center gap-1">
            {displayItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}-${Date.now()}`}
                className={`
                  w-32 h-16 flex items-center justify-center rounded-lg
                  ${item.color} transition-transform duration-100
                  ${idx === 1 ? "scale-110 ring-2 ring-yellow-300" : "scale-90 opacity-60"}
                `}
              >
                <span className="text-4xl drop-shadow-lg">{item.icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Línea de victoria central */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-16 border-y-2 border-yellow-400 pointer-events-none" />

        {/* Gradientes para fade */}
        <div className="absolute top-8 left-0 right-0 h-12 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-8 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none z-10" />

        {/* Marco decorativo inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-yellow-500 to-yellow-600 flex items-center justify-center">
          <span className="text-xl">💎</span>
        </div>
      </div>

      {/* Botón de giro */}
      <button
        onClick={startSpin}
        disabled={isSpinning || disabled}
        className={`
          px-8 py-4 text-xl font-black rounded-xl
          bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500
          hover:from-yellow-600 hover:via-orange-600 hover:to-red-600
          shadow-lg hover:shadow-xl
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${!disabled && !isSpinning ? "hover:scale-105 cursor-pointer" : ""}
        `}
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">🎰</span>
            Girando...
          </span>
        ) : disabled ? (
          "⏰ Espera..."
        ) : (
          "🎰 ¡GIRAR!"
        )}
      </button>
    </div>
  )
}
