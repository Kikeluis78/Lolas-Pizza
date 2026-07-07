import { ShoppingCart, MapPin, CheckCircle } from "lucide-react"

const STEPS = [
  { label: "Carrito", href: "/carrito", icon: ShoppingCart },
  { label: "Dirección", href: "/direccion", icon: MapPin },
  { label: "Confirmar", href: "/confirmar-pedido", icon: CheckCircle },
]

export function OrderSteps({ current }: { current: "/carrito" | "/direccion" | "/confirmar-pedido" }) {
  const currentIndex = STEPS.findIndex((s) => s.href === current)

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const done = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={step.href} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-sm font-medium ${
              active ? "text-primary" : done ? "text-green-600" : "text-muted-foreground"
            }`}>
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 ${i < currentIndex ? "bg-green-500" : "bg-border"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
