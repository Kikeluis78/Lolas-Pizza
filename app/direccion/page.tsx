"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AddressManager } from "@/components/address-manager"
import { OrderSteps } from "@/components/order-steps"

export default function DireccionPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <OrderSteps current="/direccion" />
          <h1 className="text-3xl font-bold mb-6 text-foreground">Dirección de Entrega</h1>
          <AddressManager />
        </div>
      </main>
      <Footer />
    </>
  )
}
