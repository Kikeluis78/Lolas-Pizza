"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { pizzeriaConfig } from "@/config/pizzeria.config"

interface LoadingSpinnerProps {
  onComplete: () => void
}

export function LoadingSpinner({ onComplete }: LoadingSpinnerProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => onComplete(), 300)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 w-full max-w-md px-8">
        <div className="relative">
          <Image
            src="/logoLolaspizza.png"
            alt="Lola's Pizza Logo"
            width={120}
            height={120}
            className="animate-pulse"
            priority
          />
        </div>

        <h2 className="text-2xl font-bold text-foreground"><span className="font-brand">Lola's Pizza</span></h2>

        <div className="w-full space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-center text-sm text-muted-foreground">{progress}%</p>
        </div>
      </div>
    </div>
  )
}
