"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OrderSteps } from "@/components/order-steps"
import { WhatsAppModal } from "@/components/whatsapp-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, CreditCard, ShoppingBag, MessageCircle, CheckCircle, X, User, Hash, Store } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { pizzeriaConfig } from "@/config/pizzeria.config"

interface Address {
  userName: string
  addressType: string
  street: string
  number: string
  neighborhood: string
  postalCode: string
  phone: string
  references: string
}

interface GuestData {
  name: string
  phone: string
}

// Función para generar folio único
const generateOrderId = (): string => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomLetter = letters[Math.floor(Math.random() * letters.length)]
  
  return `ORD-${randomLetter}${timestamp}${random}`
}

export default function ConfirmarPedidoPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [address, setAddress] = useState<Address | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [cashAmount, setCashAmount] = useState("")
  const [transferFolio, setTransferFolio] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [guestData, setGuestData] = useState<GuestData>({ name: "", phone: "" })
  const [orderId, setOrderId] = useState<string>("") // <-- NUEVO: Folio único
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false) // Modal para modo demo
  const [summaryOpen, setSummaryOpen] = useState(true) // Estado para expandir/colapsar resumen

  // ========== EFFECTS ==========
  useEffect(() => {
    setMounted(true)
    // Generar folio único al montar el componente
    setOrderId(generateOrderId())
  }, [])

  useEffect(() => {
    if (!mounted) return

    const userAccount = localStorage.getItem("userAccount")
    if (!userAccount) {
      setIsGuest(true)
      
      // Cargar datos de guestContact si existen
      const guestContact = localStorage.getItem("guestContact")
      if (guestContact) {
        const contact = JSON.parse(guestContact)
        setGuestData({ name: contact.name || "", phone: contact.phone || "" })
      }
    }

    // Cargar dirección principal desde deliveryAddresses
    const addresses = localStorage.getItem("deliveryAddresses")
    if (addresses) {
      const parsedAddresses = JSON.parse(addresses)
      const mainAddress = parsedAddresses.find((addr: any) => addr.isMain) || parsedAddresses[0]
      if (mainAddress) {
        setAddress(mainAddress)
      }
    }

    // Cargar datos guardados
    const savedPayment = localStorage.getItem("selectedPaymentMethod")
    const savedCash = localStorage.getItem("cashAmount")
    const savedFolio = localStorage.getItem("transferFolio")
    const savedCoupon = localStorage.getItem("appliedCoupon")

    if (savedPayment) setPaymentMethod(savedPayment)
    if (savedCash) setCashAmount(savedCash)
    if (savedFolio) setTransferFolio(savedFolio)
    if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon))

    if (items.length === 0) {
      router.push("/home")
    }

    // Validar que haya dirección si el servicio es domicilio
    const serviceType = localStorage.getItem("serviceType")
    if (serviceType === "delivery" && !addresses) {
      Swal.fire({
        icon: "warning",
        title: "Falta tu dirección",
        text: "Por favor agrega una dirección de entrega antes de confirmar tu pedido.",
        confirmButtonText: "Agregar dirección",
      }).then(() => router.push("/direccion"))
    }
  }, [mounted, items, router])

  // ========== CÁLCULOS ==========
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    return (getTotal() * appliedCoupon.discount) / 100
  }

  const getFinalTotal = () => {
    return getTotal() - calculateDiscount()
  }

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case "card":
        return "Tarjeta de Débito/Crédito"
      case "voucher":
        return "Vales Electrónicos"
      case "cash":
        return "Efectivo"
      case "transfer":
        return "Transferencia Bancaria"
      default:
        return "No especificado"
    }
  }

  // ========== NÚMERO DE WHATSAPP ==========
  // En modo DEMO: usa el número que el locatario ingrese en el modal
  // En PRODUCCIÓN: usa el número configurado en pizzeria.config.ts
  const getWhatsAppPhoneNumber = (demoPhone?: string) => {
    let phoneToUse = pizzeriaConfig.whatsapp

    // Si está en modo demo y se proporcionó un número, usarlo
    if (pizzeriaConfig.demoMode.enabled && demoPhone) {
      phoneToUse = demoPhone
    }

    const digitsOnly = phoneToUse.replace(/\D+/g, "")

    // Si tiene 10 dígitos, agregar código de país México (52)
    if (digitsOnly.length === 10) return `52${digitsOnly}`
    return digitsOnly
  }

  // ========== MENSAJE WHATSAPP ==========
  // Estructura CRM optimizada para restaurante:
  // 1. Modalidad → 2. Cliente → 3. Dirección → 4. Pago → 5. Productos → 6. Costos → 7. Folio/Fecha
  const generateWhatsAppMessage = () => {
    const userAccount = localStorage.getItem("userAccount")
    const parsedUser: { name?: string; phone?: string } | null = userAccount ? JSON.parse(userAccount) : null

    const customerName = address?.userName?.trim() || guestData.name.trim() || parsedUser?.name || "Cliente"
    const customerPhone = address?.phone?.trim() || guestData.phone.trim() || parsedUser?.phone || ""

    // Formatear fecha y hora en español (México)
    const now = new Date()
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }
    const formattedDate = now.toLocaleDateString('es-MX', dateOptions)
    const formattedTime = now.toLocaleTimeString('es-MX', timeOptions)

    let message = `*🍕 NUEVO PEDIDO - ${pizzeriaConfig.nombre.toUpperCase()}*\n\n`
    
    // 1️⃣ MODALIDAD (LO MÁS IMPORTANTE)
    if (address) {
      message += `*🚚 MODALIDAD:* ENTREGA A DOMICILIO\n\n`
    } else {
      message += `*🏪 MODALIDAD:* RECOGER EN RESTAURANTE\n\n`
    }

    // 2️⃣ DATOS DEL CLIENTE
    message += `*👤 CLIENTE:*\n`
    message += `${customerName}\n`
    message += `📱 ${customerPhone || "No especificado"}\n\n`

    // 3️⃣ DIRECCIÓN DE ENTREGA (solo si es delivery)
    if (address) {
      message += `*📍 DIRECCIÓN DE ENTREGA:*\n`
      message += `${address.street} #${address.number}\n`
      message += `Col. ${address.neighborhood}, CP ${address.postalCode}\n`
      message += `${address.addressType}\n`
      if (address.references) {
        message += `Ref: ${address.references}\n`
      }
      message += `\n`
    }

    // 4️⃣ MÉTODO DE PAGO
    message += `*💳 MÉTODO DE PAGO:* ${getPaymentMethodName()}\n`
    if (paymentMethod === "cash" && cashAmount) {
      message += `Paga con: $${cashAmount} | Cambio: $${(Number.parseFloat(cashAmount) - getFinalTotal()).toFixed(2)}\n`
    }
    if (paymentMethod === "transfer" && transferFolio) {
      message += `Folio: ${transferFolio}\n`
    }
    message += `\n`

    // 5️⃣ DETALLE DE LA ORDEN
    message += `*📦 PRODUCTOS:*\n`
    message += `─────────────────────────\n`
    items.forEach((item, index) => {
      message += `\n*${index + 1}. ${item.name}* (${item.quantity}x)\n`
      if (item.description) {
        const lines = item.description.split("\n")
        lines.forEach((line) => {
          if (line.trim()) {
            message += `   ${line}\n`
          }
        })
      }
      message += `   $${item.price.toFixed(2)} c/u → *$${(item.price * item.quantity).toFixed(2)}*\n`
    })
    message += `\n`

    // 6️⃣ RESUMEN DE COSTOS
    message += `*💰 TOTAL:*\n`
    message += `─────────────────────────\n`
    message += `Subtotal: $${getTotal().toFixed(2)}\n`
    if (appliedCoupon) {
      message += `Descuento (${appliedCoupon.code} ${appliedCoupon.discount}%): -$${calculateDiscount().toFixed(2)}\n`
    }
    message += `Envío: GRATIS\n`
    message += `*TOTAL A PAGAR: $${getFinalTotal().toFixed(2)}*\n\n`

    // 7️⃣ FOLIO Y FECHA (Referencia al final)
    message += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    message += `📋 Folio: *${orderId}*\n`
    message += `📅 ${formattedDate} - ${formattedTime}\n`
    message += `_Pedido generado automáticamente_`

    return message
  }

  // ========== HANDLERS ==========
  const handleCancelOrder = () => {
    Swal.fire({
      title: "¿Cancelar pedido?",
      text: "Volverás al carrito de compras",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/carrito")
      }
    })
  }

  const handleConfirmOrder = () => {
    const serviceType = localStorage.getItem("serviceType")
    
    // Validar datos de invitado
    if (isGuest) {
      const hasAddressIdentity = Boolean(address?.userName?.trim() && address?.phone?.trim())
      
      // Si es restaurant, solo validar nombre y teléfono
      if (serviceType === "restaurant") {
        if (!hasAddressIdentity && (!guestData.name.trim() || !guestData.phone.trim())) {
          Swal.fire({
            icon: "warning",
            title: "Datos incompletos",
            text: "Por favor ingresa tu nombre y teléfono para que podamos contactarte",
          })
          return
        }
      } else {
        // Si es delivery, validar datos completos
        if (!hasAddressIdentity && (!guestData.name.trim() || !guestData.phone.trim())) {
          Swal.fire({
            icon: "warning",
            title: "Datos incompletos",
            text: "Por favor ingresa tu nombre y teléfono para continuar",
          })
          return
        }
      }
    }

    // Si está en modo DEMO, mostrar modal para capturar WhatsApp del locatario
    if (pizzeriaConfig.demoMode.enabled) {
      setShowWhatsAppModal(true)
      return
    }

    // Si no está en modo demo, enviar directamente
    sendOrderToWhatsApp()
  }

  // ========== ENVIAR PEDIDO POR WHATSAPP ==========
  const sendOrderToWhatsApp = (demoPhone?: string) => {
    // Guardar pedido en localStorage (opcional, para historial)
    const userAccount = localStorage.getItem("userAccount")
    const parsedUser: { name?: string; phone?: string } | null = userAccount ? JSON.parse(userAccount) : null
    const customer = {
      name: address?.userName?.trim() || guestData.name.trim() || parsedUser?.name || "Cliente",
      phone: address?.phone?.trim() || guestData.phone.trim() || parsedUser?.phone || "",
    }

    const orderData = {
      id: orderId,
      items,
      total: getFinalTotal(),
      date: new Date().toISOString(),
      customer,
      address,
      paymentMethod,
      coupon: appliedCoupon,
      status: "pendiente", // Estados: pendiente, confirmado, preparando, en-camino, entregado, cancelado
      estimatedTime: 40, // Tiempo estimado en minutos
      rating: null, // Calificación del cliente (1-5 estrellas)
    }

    // Guardar en historial de pedidos
    const ordersHistory = JSON.parse(localStorage.getItem("ordersHistory") || "[]")
    ordersHistory.push(orderData)
    localStorage.setItem("ordersHistory", JSON.stringify(ordersHistory))

    // Generar y enviar mensaje por WhatsApp
    const phoneNumber = getWhatsAppPhoneNumber(demoPhone)
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, "_blank")

    // Limpiar datos
    clearCart()
    localStorage.removeItem("selectedAddress")
    localStorage.removeItem("selectedPaymentMethod")
    localStorage.removeItem("cashAmount")
    localStorage.removeItem("transferFolio")
    localStorage.removeItem("appliedCoupon")

    // Cerrar modal si estaba abierto
    setShowWhatsAppModal(false)

    // Mostrar confirmación con folio
    Swal.fire({
      icon: "success",
      title: "¡Pedido Enviado!",
      html: `
        <div class="text-center">
          <p>Tu pedido ha sido enviado por WhatsApp</p>
          <p class="mt-2 font-bold text-lg text-primary">Folio: ${orderId}</p>
          <p class="text-sm text-muted-foreground mt-1">Guarda este folio para seguimiento</p>
        </div>
      `,
      confirmButtonText: "Volver al inicio",
    }).then(() => {
      router.push("/home")
    })
  }

  // ========== RENDER CONDICIONAL ==========
  if (!mounted) {
    return null
  }

  if (items.length === 0) {
    return null
  }

  // ========== COMPONENTES ==========
  const OrderHeader = () => (
    <Card className="mb-6 border-dashed border-primary">
      <CardHeader className="bg-muted/20">
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          Folio del Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-primary tracking-wider">{orderId}</p>
            <p className="text-sm text-muted-foreground mt-1">Este folio será tu referencia de seguimiento</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(orderId)
              Swal.fire({
                icon: 'success',
                title: 'Copiado',
                text: 'Folio copiado al portapapeles',
                timer: 1500,
                showConfirmButton: false
              })
            }}
          >
            Copiar Folio
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const GuestDataForm = () => {
    const serviceType = localStorage.getItem("serviceType")
    const isRestaurant = serviceType === "restaurant"
    
    return (
      <Card className="border-primary mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Tus Datos de Contacto
          </CardTitle>
          <CardDescription>
            {isRestaurant 
              ? "Para contactarte cuando tu pedido esté listo para recoger"
              : "Ingresa tus datos para completar el pedido"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Nombre completo *</Label>
            <Input
              id="guestName"
              type="text"
              placeholder="Juan Pérez"
              value={guestData.name}
              onChange={(e) => {
                const newData = { ...guestData, name: e.target.value }
                setGuestData(newData)
                if (isRestaurant) {
                  localStorage.setItem("guestContact", JSON.stringify(newData))
                }
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestPhone">Teléfono *</Label>
            <Input
              id="guestPhone"
              type="tel"
              placeholder="5512345678"
              value={guestData.phone}
              onChange={(e) => {
                const newData = { ...guestData, phone: e.target.value }
                setGuestData(newData)
                if (isRestaurant) {
                  localStorage.setItem("guestContact", JSON.stringify(newData))
                }
              }}
              required
            />
            {isRestaurant && (
              <p className="text-xs text-muted-foreground">
                Te contactaremos si hay algún retraso o cuando tu pedido esté listo
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const UserInfoSection = () => {
    const serviceType = localStorage.getItem("serviceType")
    const isRestaurant = serviceType === "restaurant"
    
    if (isGuest && !address) {
      return <GuestDataForm />
    }

    const userAccount = localStorage.getItem("userAccount")
    const user: { name?: string; phone?: string } | null = userAccount ? JSON.parse(userAccount) : null

    const displayName = address?.userName?.trim() || user?.name || guestData.name
    const displayPhone = address?.phone?.trim() || user?.phone || guestData.phone

    if (!displayName && !displayPhone && !address) return null

    return (
      <Card className="mb-6 border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-primary" />
            {isRestaurant ? "Contacto" : "Cliente y Entrega"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex-1">
              <p className="font-semibold">{displayName || "No especificado"}</p>
            </div>
            <div className="text-muted-foreground">
              📱 {displayPhone || "Sin teléfono"}
            </div>
          </div>

          {address ? (
            <div className="pt-3 border-t text-sm space-y-1">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{address.street} #{address.number}</p>
                  <p className="text-muted-foreground">{address.neighborhood}, CP {address.postalCode}</p>
                  {address.references && (
                    <p className="text-xs text-muted-foreground mt-1">Ref: {address.references}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Store className="h-4 w-4 text-primary" />
                <p className="font-medium">Recoger en restaurante</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const OrderSummary = () => (
    <Card className="mb-6">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setSummaryOpen((v) => !v)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Detalle del Pedido ({items.reduce((s, i) => s + i.quantity, 0)} productos)
          </div>
          <span className="text-muted-foreground text-sm">{summaryOpen ? "▲ Ocultar" : "▼ Ver"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {summaryOpen && (<>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-start pb-3 border-b last:border-0">
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{item.description}</p>
              <p className="text-sm text-muted-foreground mt-1">Cantidad: {item.quantity}</p>
            </div>
            <p className="font-bold text-primary">${item.price * item.quantity}</p>
          </div>
        ))}
        </>)}

        <div className="pt-4 space-y-2 border-t">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-semibold">${getTotal()}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Descuento ({appliedCoupon.discount}%):</span>
              <span className="font-semibold">-${calculateDiscount().toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Envío:</span>
            <span className="font-semibold text-green-600 dark:text-green-400">GRATIS</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2">
            <span>Total:</span>
            <span className="text-primary">${getFinalTotal().toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const PaymentMethod = () => (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="h-4 w-4" />
          Método de Pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold">{getPaymentMethodName()}</p>
        {paymentMethod === "cash" && cashAmount && (
          <p className="text-sm text-muted-foreground mt-1">
            Paga con: ${cashAmount} • Cambio: ${(Number.parseFloat(cashAmount) - getFinalTotal()).toFixed(2)}
          </p>
        )}
        {paymentMethod === "transfer" && transferFolio && (
          <p className="text-sm text-muted-foreground mt-1">
            Folio: {transferFolio}
          </p>
        )}
      </CardContent>
    </Card>
  )

  const ConfirmationButtons = () => (
    <Card className="border-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="h-4 w-4" />
          Confirmar Pedido
        </CardTitle>
        <CardDescription className="text-xs">
          Folio: <span className="font-mono font-semibold text-primary">{orderId}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={handleConfirmOrder} className="w-full" size="lg">
          <MessageCircle className="h-5 w-5 mr-2" />
          Enviar por WhatsApp
        </Button>
        <Button onClick={handleCancelOrder} variant="outline" className="w-full" size="sm">
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </CardContent>
    </Card>
  )

  // ========== RENDER PRINCIPAL ==========
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <OrderSteps current="/confirmar-pedido" />
          {/* Título */}
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Confirmar Pedido</h1>
              <p className="text-muted-foreground">Revisa todos los detalles antes de enviar</p>
            </div>
          </div>

          {/* Secciones en orden lógico */}
          <div className="space-y-6">
            {/* 0. Folio del pedido */}
            <OrderHeader />

            {/* 1. Datos del cliente y entrega (unificado) */}
            <UserInfoSection />

            {/* 2. Detalle del pedido */}
            <OrderSummary />

            {/* 3. Método de pago */}
            <PaymentMethod />

            {/* 5. Botones de confirmación */}
            <ConfirmationButtons />
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal de WhatsApp para modo DEMO */}
      <WhatsAppModal
        open={showWhatsAppModal}
        onConfirm={(phone) => sendOrderToWhatsApp(phone)}
        onCancel={() => setShowWhatsAppModal(false)}
      />
    </>
  )
}