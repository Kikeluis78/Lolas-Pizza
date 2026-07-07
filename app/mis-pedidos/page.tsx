"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OrderTracking } from "@/components/order-tracking"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Calendar, MapPin, CreditCard, Package } from "lucide-react"
import { useRouter } from "next/navigation"

interface Order {
  id: string
  items: any[]
  total: number
  date: string
  customer: { name: string; phone: string }
  address: any
  paymentMethod: string
  coupon: any
  status?: string
  estimatedTime?: number
  rating?: number | null
}

export default function MisPedidosPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    setMounted(true)
    const ordersHistory = localStorage.getItem("ordersHistory")
    if (ordersHistory) {
      const parsed = JSON.parse(ordersHistory)
      // Ordenar por fecha más reciente primero
      const sorted = parsed.sort((a: Order, b: Order) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      setOrders(sorted)
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      card: "Tarjeta",
      cash: "Efectivo",
      transfer: "Transferencia",
      voucher: "Vales"
    }
    return methods[method] || method
  }

  const getStatusBadge = (status?: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      pendiente: { label: "Pendiente", color: "bg-yellow-600" },
      confirmado: { label: "Confirmado", color: "bg-blue-600" },
      preparando: { label: "Preparando", color: "bg-orange-600" },
      "en-camino": { label: "En Camino", color: "bg-purple-600" },
      entregado: { label: "Entregado", color: "bg-green-600" },
      cancelado: { label: "Cancelado", color: "bg-red-600" },
    }
    
    const config = statusConfig[status || "entregado"] || statusConfig.entregado
    return { label: config.label, color: config.color }
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Título */}
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mis Pedidos</h1>
              <p className="text-muted-foreground">Historial de tus pedidos realizados</p>
            </div>
          </div>

          {/* Lista de Pedidos */}
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          Pedido #{order.id}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.date)}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadge(order.status).color}>
                        {getStatusBadge(order.status).label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {/* Tracking Visual */}
                    {order.status && order.status !== "entregado" && order.status !== "cancelado" && (
                      <div className="mb-4">
                        <OrderTracking status={order.status} />
                      </div>
                    )}

                    {/* Productos */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Productos:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-medium">${item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dirección */}
                    {order.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Entregado en:</p>
                          <p className="text-muted-foreground">
                            {order.address.street} #{order.address.number}, {order.address.neighborhood}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Método de Pago */}
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Pago:</span>
                      <span className="text-muted-foreground">{getPaymentMethodName(order.paymentMethod)}</span>
                    </div>

                    {/* Tiempo Estimado */}
                    {order.estimatedTime && order.status !== "entregado" && order.status !== "cancelado" && (
                      <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          Tiempo estimado: {order.estimatedTime} minutos
                        </span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</span>
                    </div>

                    {/* Botón Volver a Pedir */}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push("/home")}
                    >
                      Volver a Pedir
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Sin pedidos
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="h-20 w-20 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tienes pedidos aún</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Cuando realices tu primer pedido, aparecerá aquí
                </p>
                <Button onClick={() => router.push("/home")} size="lg">
                  Hacer mi Primer Pedido
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
