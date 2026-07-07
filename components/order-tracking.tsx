"use client"

import { Check, Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react"

interface OrderTrackingProps {
  status: string
}

export function OrderTracking({ status }: OrderTrackingProps) {
  const steps = [
    { key: "pendiente", label: "Pendiente", icon: Clock },
    { key: "confirmado", label: "Confirmado", icon: Check },
    { key: "preparando", label: "Preparando", icon: Package },
    { key: "en-camino", label: "En Camino", icon: Truck },
    { key: "entregado", label: "Entregado", icon: CheckCircle },
  ]

  const statusIndex = steps.findIndex((s) => s.key === status)
  const isCanceled = status === "cancelado"

  if (isCanceled) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
        <XCircle className="h-5 w-5 text-red-600" />
        <span className="font-semibold text-red-900 dark:text-red-100">Pedido Cancelado</span>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative">
        {/* Línea de progreso */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(statusIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index <= statusIndex
          const isCurrent = index === statusIndex

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                  ${isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                  ${isCurrent ? "ring-4 ring-primary/30 scale-110" : ""}
                `}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`
                  text-xs text-center font-medium
                  ${isCompleted ? "text-foreground" : "text-muted-foreground"}
                  ${isCurrent ? "font-bold" : ""}
                `}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
